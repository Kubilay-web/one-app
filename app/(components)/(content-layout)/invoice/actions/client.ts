"use server";

import { notFound } from "next/navigation";
import db from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/app/auth";
import { ClientData, ClientInvoiceData, CreateClientData, InvoiceStatus, UpdateClientData } from "../types/client";



// Helper function to check client limit
async function checkClientLimit(userId: string): Promise<{
  canCreate: boolean;
  message?: string;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    return { canCreate: false, message: "User not found" };
  }

  // Get plan limits
  const planLimit = await db.planLimit.findUnique({
    where: { plan: user.subscription?.plan || "FREE" },
  });

  // If maxClients is null, it means unlimited
  if (planLimit?.maxClients === null) {
    return { canCreate: true };
  }

  // Count current clients
  const clientCount = await db.client.count({
    where: { userId },
  });

  if (planLimit?.maxClients && clientCount >= planLimit.maxClients) {
    return {
      canCreate: false,
      message: `You have reached the maximum number of clients (${planLimit.maxClients}) for your plan. Please upgrade to add more clients.`,
    };
  }

  return { canCreate: true };
}

// Get all clients for the authenticated user with pagination
// export async function getClients(
//   page: number = 1,
//   limit: number = 10,
//   includeInactive: boolean = false
// ): Promise<{
//   clients: ClientData[];
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalCount: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
// }> {
//   try {
//     const {user} = await validateRequest();
//     const userId = user?.id;

//     const offset = (page - 1) * limit;

//     const where = {
//       userId,
//       ...(includeInactive ? {} : { isActive: true }),
//     };

//     // Fetch clients with invoice statistics
//     const [clients, totalCount] = await Promise.all([
//       db.client.findMany({
//         where,
//         include: {
//           invoices: {
//             select: {
//               totalAmount: true,
//               status: true,
//             },
//           },
//           _count: {
//             select: {
//               invoices: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//         skip: offset,
//         take: limit,
//       }),
//       db.client.count({ where }),
//     ]);

//     // Transform data and calculate statistics
//     const clientsWithStats: ClientData[] = clients.map((client) => {
//       const totalInvoices = client._count.invoices;
//       const totalAmount = client.invoices.reduce(
//         (sum, invoice) => sum + Number(invoice.totalAmount),
//         0
//       );
//       const paidAmount = client.invoices
//         .filter((invoice) => invoice.status === InvoiceStatus.PAID)
//         .reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
//       const unpaidAmount = totalAmount - paidAmount;

//       return {
//         id: client.id,
//         contactPerson: client.contactPerson,
//         companyName: client.companyName,
//         location: client.location,
//         phone: client.phone,
//         email: client.email,
//         customerID: client.customerID,
//         notes: client.notes,
//         isActive: client.isActive,
//         createdAt: client.createdAt.toISOString(),
//         updatedAt: client.updatedAt.toISOString(),
//         totalInvoices,
//         totalAmount,
//         paidAmount,
//         unpaidAmount,
//       };
//     });

//     const totalPages = Math.ceil(totalCount / limit);

//     return {
//       clients: clientsWithStats,
//       pagination: {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching clients:", error);
//     if (error instanceof Error && error.message === "Unauthorized") {
//       throw new Error("Unauthorized");
//     }
//     return {
//       clients: [],
//       pagination: {
//         currentPage: 1,
//         totalPages: 0,
//         totalCount: 0,
//         hasNextPage: false,
//         hasPrevPage: false,
//       },
//     };
//   }
// }







export async function getClients(): Promise<ClientData[]> {
  const { user } = await validateRequest();

  const clients = await db.client.findMany({
    where: { userId: user.id, isActive: true },
    include: {
      invoices: true,
      _count: { select: { invoices: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return clients.map(client => {
    const totalInvoices = client._count.invoices;
    const totalAmount = client.invoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmount || 0),
      0
    );
    const paidAmount = client.invoices
      .filter(inv => inv.status === InvoiceStatus.PAID)
      .reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);
    const unpaidAmount = totalAmount - paidAmount;

    return {
      id: client.id,
      contactPerson: client.contactPerson,
      companyName: client.companyName,
      location: client.location,
      phone: client.phone,
      email: client.email,
      customerID: client.customerID,
      isActive: client.isActive,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      totalInvoices,
      totalAmount,
      paidAmount,
      unpaidAmount
    };
  });
}



// Get all clients (simplified version for dropdowns)
export async function getClientsSimple(): Promise<
  Array<{
    id: string;
    contactPerson: string;
    companyName: string;
    email: string | null;
  }>
> {
  try {
    const {user} = await validateRequest();
    const userId = user.id;

    const clients = await db.client.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        id: true,
        contactPerson: true,
        companyName: true,
        email: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

// Get client by ID with detailed information
export async function getClientById(clientId: string): Promise<ClientData> {
  try {
    const {user} = await validateRequest();
    const userId = user.id;

    const client = await db.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
      include: {
        invoices: {
          select: {
            totalAmount: true,
            status: true,
          },
        },
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });

    if (!client) {
      notFound();
    }

    // Calculate statistics
    const totalInvoices = client._count.invoices;
    const totalAmount = client.invoices.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount),
      0
    );
    const paidAmount = client.invoices
      .filter((invoice) => invoice.status === InvoiceStatus.PAID)
      .reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
    const unpaidAmount = totalAmount - paidAmount;

    return {
      id: client.id,
      contactPerson: client.contactPerson,
      companyName: client.companyName,
      location: client.location,
      phone: client.phone,
      email: client.email,
      customerID: client.customerID,
      notes: client.notes,
      isActive: client.isActive,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      totalInvoices,
      totalAmount,
      paidAmount,
      unpaidAmount,
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw new Error("Unauthorized");
    }
    notFound();
  }
}

// Get last client by user ID (for invoice form)
export async function getLastClientByUserId(
  userId: string,
  clientId: string | undefined
) {
  try {
    // Verify authorization
   const {user} = await validateRequest();
    if (user.id !== userId) {
      throw new Error("Unauthorized");
    }

    let client = null;

    if (clientId) {
      client = await db.client.findFirst({
        where: {
          id: clientId,
          userId,
        },
      });
    } else {
      client = await db.client.findFirst({
        where: {
          userId,
          isActive: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    if (!client) {
      return undefined;
    }

    return {
      billToContactPerson: client.contactPerson,
      billToCompanyName: client.companyName,
      billToLocation: client.location,
      billToPhone: client.phone,
      customerID: client.customerID,
      clientId: client.id,
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    return undefined;
  }
}

// Create a new client
export async function createClient(data: CreateClientData) {
  try {
 const {user} = await validateRequest();
    const userId = user.id;

    // Check client limit
    const limitCheck = await checkClientLimit(userId);
    if (!limitCheck.canCreate) {
      return {
        success: false,
        error: limitCheck.message,
      };
    }

    // Validate required fields
    if (!data.contactPerson || data.contactPerson.trim().length < 2) {
      return {
        success: false,
        error: "Contact person name must be at least 2 characters",
      };
    }

    if (!data.companyName || data.companyName.trim().length < 2) {
      return {
        success: false,
        error: "Company name must be at least 2 characters",
      };
    }

    // Validate email format if provided
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    // Clean up data
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }
      if (value === "") {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const client = await db.client.create({
      data: {
        userId,
        ...cleanedData,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      client: {
        ...client,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error creating client:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to create client" };
  }
}

// Update client
export async function updateClient(clientId: string, data: UpdateClientData) {
  try {
    const {user} = await validateRequest();
    const userId = user.id;

    // Check if client exists and belongs to user
    const existingClient = await db.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    });

    if (!existingClient) {
      return { success: false, error: "Client not found" };
    }

    // Validate data if provided
    if (data.contactPerson !== undefined && data.contactPerson.trim().length < 2) {
      return {
        success: false,
        error: "Contact person name must be at least 2 characters",
      };
    }

    if (data.companyName !== undefined && data.companyName.trim().length < 2) {
      return {
        success: false,
        error: "Company name must be at least 2 characters",
      };
    }

    if (data.email !== undefined && data.email !== null && 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    // Clean up data
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }
      if (value === "") {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const updatedClient = await db.client.update({
      where: {
        id: clientId,
      },
      data: cleanedData,
    });

    revalidatePath("/dashboard/clients");
    revalidatePath(`/dashboard/clients/${clientId}`);

    return {
      success: true,
      client: {
        ...updatedClient,
        createdAt: updatedClient.createdAt.toISOString(),
        updatedAt: updatedClient.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating client:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to update client" };
  }
}

// Get all invoices for a specific client
export async function getClientInvoices(
  clientId: string
): Promise<ClientInvoiceData[]> {
  try {
 const {user} = await validateRequest();
    const userId = user?.id;

    // First verify the client belongs to the user
    const client = await db.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    });

    if (!client) {
      notFound();
    }

    // Fetch client invoices
    const invoices = await db.invoiceModel.findMany({
      where: {
        clientId,
        userId,
      },
      orderBy: {
        invoiceDate: "desc",
      },
    });

    // Transform data and calculate remaining days
    const today = new Date();
    const clientInvoices: ClientInvoiceData[] = invoices.map((invoice) => {
      const dueDate = new Date(invoice.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const isPastDue =
        remainingDays < 0 && invoice.status !== InvoiceStatus.PAID;

      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        status: invoice.status as InvoiceStatus,
        subtotal: Number(invoice.subtotal),
        taxAmount: Number(invoice.taxAmount),
        totalAmount: Number(invoice.totalAmount),
        isPastDue,
        remainingDays,
        preparedBy: invoice.preparedBy,
      };
    });

    return clientInvoices;
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw new Error("Unauthorized");
    }
    return [];
  }
}

// Get client statistics summary
export async function getClientStats(clientId: string) {
  try {
 const {user} = await validateRequest();
    const userId = user?.id;

    // Verify client belongs to user
    const client = await db.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    // Get invoices grouped by status
    const invoiceStats = await db.invoiceModel.groupBy({
      by: ["status"],
      where: {
        clientId,
        userId,
      },
      _count: {
        status: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Get recent invoices (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentInvoicesCount = await db.invoiceModel.count({
      where: {
        clientId,
        userId,
        invoiceDate: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get overdue invoices
    const overdueInvoicesCount = await db.invoiceModel.count({
      where: {
        clientId,
        userId,
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: InvoiceStatus.PAID,
        },
      },
    });

    // Get total lifetime value
    const lifetimeValue = await db.invoiceModel.aggregate({
      where: {
        clientId,
        userId,
        status: InvoiceStatus.PAID,
      },
      _sum: {
        totalAmount: true,
      },
    });

    return {
      invoiceStats: invoiceStats.map((stat) => ({
        status: stat.status,
        count: stat._count.status,
        amount: Number(stat._sum.totalAmount || 0),
      })),
      recentInvoicesCount,
      overdueInvoicesCount,
      lifetimeValue: Number(lifetimeValue._sum.totalAmount || 0),
      averageInvoiceValue: recentInvoicesCount > 0 
        ? Number(lifetimeValue._sum.totalAmount || 0) / recentInvoicesCount 
        : 0,
    };
  } catch (error) {
    console.error("Error fetching client stats:", error);
    throw new Error("Failed to fetch client statistics");
  }
}

// Delete client (with validation)
export async function deleteClient(clientId: string) {
  try {
 const {user} = await validateRequest();
    const userId = user.id;

    // Check if client has any invoices
    const invoiceCount = await db.invoiceModel.count({
      where: {
        clientId,
        userId,
      },
    });

    if (invoiceCount > 0) {
      return {
        success: false,
        error: "Cannot delete client with existing invoices. You can deactivate the client instead.",
      };
    }

    // Delete the client
    await db.client.delete({
      where: {
        id: clientId,
        userId,
      },
    });

    revalidatePath("/dashboard/clients");
    return { success: true, error: "" };
  } catch (error) {
    console.error("Error deleting client:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete client",
    };
  }
}

// Toggle client active status
export async function toggleClientStatus(clientId: string) {
  try {
 const {user} = await validateRequest();
    const userId = user.id;

    const client = await db.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    });

    if (!client) {
      return { success: false, error: "Client not found" };
    }

    const updatedClient = await db.client.update({
      where: {
        id: clientId,
      },
      data: {
        isActive: !client.isActive,
      },
    });

    revalidatePath("/dashboard/clients");
    revalidatePath(`/dashboard/clients/${clientId}`);

    return {
      success: true,
      isActive: updatedClient.isActive,
    };
  } catch (error) {
    console.error("Error toggling client status:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to toggle client status" };
  }
}

// Search clients
export async function searchClients(searchTerm: string) {
  try {
    const {user} = await validateRequest();
    const userId = user.id;

    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const clients = await db.client.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          {
            contactPerson: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            companyName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            customerID: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        contactPerson: true,
        companyName: true,
        email: true,
        customerID: true,
      },
      take: 10,
    });

    return clients;
  } catch (error) {
    console.error("Error searching clients:", error);
    return [];
  }
}