"use server";

// import { ResetPasswordEmail } from "@/components/email-templates/reset-password";
import db from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { generateToken } from "../lib/token";
import { z } from "zod";
import { validateRequest } from "@/app/auth";
import { SubscriptionPlan, SubscriptionStatus, UserRole } from "../types/user";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";




// Validation schemas
const UpdateUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  jobTitle: z.string().optional(),
  image: z.string().optional(),
});

const UpdateUserAdminSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  jobTitle: z.string().optional(),
  image: z.string().optional(),
  role: z.enum([UserRole.USER, UserRole.ADMIN, UserRole.SERVICE_PROVIDER]).optional(),
  status: z.string().optional(),
  isVerified: z.boolean().optional(),
});

type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
type UpdateUserAdminInput = z.infer<typeof UpdateUserAdminSchema>;

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const { user } = await validateRequest();

  if (!user?.email) {
    throw new Error("Unauthorized");
  }

  const userData = await db.user.findUnique({
    where: { email: user.email },
    include: {
      subscription: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  return userData;
}

// Check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === UserRole.ADMIN;
}

// Get all members (simplified list)
export async function getAllMembers() {
  try {
    const members = await db.user.findMany({
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

// Get all users with pagination (admin only)
export async function getAllUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  role?: UserRole
) {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // Check if user is admin
    const userIsAdmin = await isAdmin(currentUser.id);
    if (!userIsAdmin) {
      throw new Error("Unauthorized: Admin access required");
    }

    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && { role }),
    };

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          subscription: {
            select: {
              plan: true,
              status: true,
              currentPeriodEnd: true,
            },
          },
          _count: {
            select: {
              invoices: true,
              clients: true,
            },
          },
        },
        orderBy: [
          {
            totalInvoicesCreated: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      jobTitle: user.jobTitle,
      role: user.role as UserRole,
      status: user.status || "ACTIVE",
      isVerified: user.isVerified || false,
      image: user.image,
      totalInvoices: user._count.invoices,
      totalClients: user._count.clients,
      totalInvoicesCreated: user.totalInvoicesCreated || 0,
      subscription: user.subscription ? {
        plan: user.subscription.plan as SubscriptionPlan,
        status: user.subscription.status as SubscriptionStatus,
        currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString(),
      } : null,
      createdAt: user.createdAt.toISOString(),
    }));

    return {
      users: formattedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw new Error("Unauthorized");
    }
    return {
      users: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

// Delete user (admin only or self)
export async function deleteUser(id: string) {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // Check if user has permission (admin or deleting themselves)
    const hasPermission = currentUser.id === id || await isAdmin(currentUser.id);
    
    if (!hasPermission) {
      return {
        ok: false,
        error: "Unauthorized to delete this user",
      };
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return {
        ok: false,
        error: "User not found",
      };
    }

    // Start transaction to delete all user data
    await db.$transaction(async (tx) => {
      // Delete invoice items
      const invoices = await tx.invoiceModel.findMany({
        where: { userId: id },
        select: { id: true },
      });

      for (const invoice of invoices) {
        await tx.invoiceItem.deleteMany({
          where: { invoiceId: invoice.id },
        });
      }

      // Delete invoices
      await tx.invoiceModel.deleteMany({
        where: { userId: id },
      });

      // Delete clients
      await tx.client.deleteMany({
        where: { userId: id },
      });

      // Delete brand
      await tx.brand.deleteMany({
        where: { userId: id },
      });

      // Delete subscription
      await tx.subscriptionInvoice.deleteMany({
        where: { userId: id },
      });

      // Delete account records
      await tx.accountInvoice.deleteMany({
        where: { userId: id },
      });

      // Finally delete user
      await tx.user.delete({
        where: { id },
      });
    });

    revalidatePath("/admin/users");
    
    return {
      ok: true,
      data: user,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // Check if user has permission
    const hasPermission = currentUser.id === id || await isAdmin(currentUser.id);
    
    if (!hasPermission) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        brand: true,
        _count: {
          select: {
            invoices: true,
            clients: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      role: user.role as UserRole,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastInvoiceDate: user.lastInvoiceDate?.toISOString(),
      subscription: user.subscription ? {
        ...user.subscription,
        plan: user.subscription.plan as SubscriptionPlan,
        status: user.subscription.status as SubscriptionStatus,
        createdAt: user.subscription.createdAt.toISOString(),
        updatedAt: user.subscription.updatedAt.toISOString(),
        currentPeriodStart: user.subscription.currentPeriodStart?.toISOString(),
        currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString(),
        cancelAt: user.subscription.cancelAt?.toISOString(),
        canceledAt: user.subscription.canceledAt?.toISOString(),
        trialStart: user.subscription.trialStart?.toISOString(),
        trialEnd: user.subscription.trialEnd?.toISOString(),
      } : null,
      brand: user.brand ? {
        ...user.brand,
        createdAt: user.brand.createdAt.toISOString(),
        updatedAt: user.brand.updatedAt.toISOString(),
      } : null,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Send reset password link
export async function sendResetLink(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        status: 404,
        error: "We cannot associate this email with any user",
        data: null,
      };
    }

    const token = generateToken();
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1); // Token expires in 1 hour

    await db.user.update({
      where: { email },
      data: {
        token,
        tokenExpiry: expiryTime,
      },
    });

    const userFirstname = user.firstName || user.name || "User";
    const resetPasswordLink = `${baseUrl}/reset-password?token=${token}&email=${email}`;

    // const { data, error } = await resend.emails.send({
    //   from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    //   to: email,
    //   subject: "Reset Your Password",
    //   react: ResetPasswordEmail({ 
    //     userFirstname, 
    //     resetPasswordLink,
    //     companyName: "Invoice Generator",
    //   }),
    // });

    // if (error) {
    //   console.error("Resend error:", error);
    //   return {
    //     status: 500,
    //     error: error.message,
    //     data: null,
    //   };
    // }

    // return {
    //   status: 200,
    //   error: null,
    //   data: data,
    // };


  } catch (error) {
    console.error("Error sending reset link:", error);
    return {
      status: 500,
      error: "Failed to send reset link",
      data: null,
    };
  }
}

// Update user profile (self)
export async function updateUser(userId: string, data: UpdateUserInput) {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // Check if user is updating their own profile
    if (currentUser.id !== userId) {
      return {
        error: "Unauthorized to update this user",
      };
    }

    // Validate input data
    const validatedData = UpdateUserSchema.parse(data);

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== currentUser.email) {
      const existingUser = await db.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return {
          error: "Email already in use",
        };
      }
    }

    // Check if phone is being changed and if it's already taken
    if (data.phone && data.phone !== currentUser.phone) {
      const existingUser = await db.user.findFirst({
        where: {
          phone: data.phone,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return {
          error: "Phone number already in use",
        };
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        jobTitle: validatedData.jobTitle,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        image: validatedData.image,
      },
    });

    // Revalidate user data
    revalidatePath("/dashboard/settings/profile");
    revalidatePath("/dashboard");

    return {
      data: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    
    if (error instanceof z.ZodError) {
      return {
        error: "Invalid data provided: " + error.errors.map(e => e.message).join(", "),
      };
    }

    return {
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

// Update user by admin
export async function updateUserByAdmin(userId: string, data: UpdateUserAdminInput) {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // Check if user is admin
    const userIsAdmin = await isAdmin(currentUser.id);
    if (!userIsAdmin) {
      return {
        error: "Unauthorized: Admin access required",
      };
    }

    // Validate input data
    const validatedData = UpdateUserAdminSchema.parse(data);

    // Check if email is being changed and if it's already taken
    if (data.email) {
      const existingUser = await db.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return {
          error: "Email already in use",
        };
      }
    }

    // Check if phone is being changed and if it's already taken
    if (data.phone) {
      const existingUser = await db.user.findFirst({
        where: {
          phone: data.phone,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return {
          error: "Phone number already in use",
        };
      }
    }

    // Prepare update data
    const updateData: any = { ...validatedData };

    // Update name if firstName and lastName are provided
    if (validatedData.firstName && validatedData.lastName) {
      updateData.name = `${validatedData.firstName} ${validatedData.lastName}`;
    } else if (validatedData.firstName) {
      // Get current user to combine
      const user = await db.user.findUnique({ where: { id: userId } });
      updateData.name = `${validatedData.firstName} ${user?.lastName || ''}`.trim();
    } else if (validatedData.lastName) {
      const user = await db.user.findUnique({ where: { id: userId } });
      updateData.name = `${user?.firstName || ''} ${validatedData.lastName}`.trim();
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

    return {
      data: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error updating user by admin:", error);
    
    if (error instanceof z.ZodError) {
      return {
        error: "Invalid data provided",
      };
    }

    return {
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

// Get user plan and remaining invoices
export async function getUserPlan(userId: string) {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // Check if user has permission
    const hasPermission = currentUser.id === userId || await isAdmin(currentUser.id);
    
    if (!hasPermission) {
      return {
        currentPlan: SubscriptionPlan.FREE,
        remainingInvoices: 0,
        dailyLimit: 2,
        dailyUsed: 0,
        remainingDaily: 2,
      };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return {
        currentPlan: SubscriptionPlan.FREE,
        remainingInvoices: 0,
        dailyLimit: 2,
        dailyUsed: 0,
        remainingDaily: 2,
      };
    }

    // Get plan limits
    const planLimits = await db.planLimit.findUnique({
      where: { plan: user.subscription?.plan || SubscriptionPlan.FREE },
    });

    const dailyLimit = planLimits?.maxDailyInvoices || 2;
    const hasUnlimited = user.subscription?.plan !== SubscriptionPlan.FREE;

    // Calculate daily usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyUsed = await db.invoiceModel.count({
      where: {
        userId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const remainingDaily = Math.max(0, dailyLimit - dailyUsed);

    return {
      currentPlan: user.subscription?.plan || SubscriptionPlan.FREE,
      remainingInvoices: hasUnlimited ? Infinity : remainingDaily,
      dailyLimit,
      dailyUsed,
      remainingDaily,
      hasUnlimited,
      subscriptionStatus: user.subscription?.status || SubscriptionStatus.INACTIVE,
    };
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return {
      currentPlan: SubscriptionPlan.FREE,
      remainingInvoices: 0,
      dailyLimit: 2,
      dailyUsed: 0,
      remainingDaily: 2,
      hasUnlimited: false,
      subscriptionStatus: SubscriptionStatus.INACTIVE,
    };
  }
}

// Verify reset token
export async function verifyResetToken(token: string, email: string) {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
        token,
        tokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        valid: false,
        error: "Invalid or expired token",
      };
    }

    return {
      valid: true,
      userId: user.id,
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    return {
      valid: false,
      error: "Failed to verify token",
    };
  }
}

// Reset password
export async function resetPassword(token: string, email: string, newPassword: string) {
  try {
    // Verify token first
    const verification = await verifyResetToken(token, email);
    
    if (!verification.valid) {
      return {
        success: false,
        error: verification.error || "Invalid token",
      };
    }

    // Hash password here (implement your password hashing)
    // const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await db.user.update({
      where: { email },
      data: {
        // password: hashedPassword,
        token: null,
        tokenExpiry: null,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      error: "Failed to reset password",
    };
  }
}

// Get user statistics (admin only)
export async function getUserStatistics() {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // Check if user is admin
    const userIsAdmin = await isAdmin(currentUser.id);
    if (!userIsAdmin) {
      throw new Error("Unauthorized: Admin access required");
    }

    const [
      totalUsers,
      activeUsers,
      usersByRole,
      usersByPlan,
      recentUsers,
    ] = await Promise.all([
      // Total users
      db.user.count(),

      // Active users (users with invoices in last 30 days)
      db.user.count({
        where: {
          lastInvoiceDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Users by role
      db.user.groupBy({
        by: ["role"],
        _count: {
          role: true,
        },
      }),

      // Users by subscription plan
      db.subscriptionInvoice.groupBy({
        by: ["plan"],
        _count: {
          plan: true,
        },
      }),

      // Recent users
      db.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

    const roleCounts: Record<string, number> = {};
    usersByRole.forEach(item => {
      roleCounts[item.role] = item._count.role;
    });

    const planCounts: Record<string, number> = {};
    usersByPlan.forEach(item => {
      planCounts[item.plan] = item._count.plan;
    });

    return {
      totalUsers,
      activeUsers,
      roleCounts,
      planCounts,
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return null;
  }
}