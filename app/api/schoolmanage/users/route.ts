import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from "@/app/lib/db";
import { UserCreateProps, UserLoginProps } from '../types/types';
import { UserRoleSchool } from '@prisma/client';
import jwt from 'jsonwebtoken';

// ==================== YARDIMCI FONKSİYONLAR ====================
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

async function createUserService(data: UserCreateProps) {
  // Check if the user already exists
  const existingEmail = await db.user.findUnique({
    where: { email: data.email },
  });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  // Hash the Password
  const hashedPassword = await bcrypt.hash(data.password, 10);
  // const userData = { ...data, password: hashedPassword };

    const userData = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: hashedPassword,
    image: data.image,
    schoolId: data.schoolId,
    schoolName: data.schoolName,
    // roleschool alanına yaz
    roleschool: data.role as UserRoleSchool,
    // role alanı için varsayılan (UserRoleSchool enum'unda geçerli bir değer)
    role: "USER" as UserRoleSchool,
  };


  const newUser = await db.user.create({
    data: userData,
  });


  console.log(`User created successfully: ${newUser.name} (${newUser.id})`);
  return newUser;
}

// ==================== GET İŞLEMLERİ ====================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const schoolId = searchParams.get('schoolId');
    const role = searchParams.get('role') as UserRoleSchool | null;
    const type = searchParams.get('type'); // 'profile', 'staff', 'all'

    // Get user profile ID by role
    if (type === 'profile' && userId && role) {
      let profileId = null;
      
      if (role === "PARENT") {
        const parent = await db.parent.findUnique({
          where: { userId },
          select: { id: true },
        });
        profileId = parent?.id;
      } else if (role === "TEACHER") {
        const teacher = await db.teacher.findUnique({
          where: { userId },
          select: { id: true },
        });
        profileId = teacher?.id;
      } else if (role === "STUDENT") {
        const student = await db.student.findUnique({
          where: { userId },
          select: { id: true },
        });
        profileId = student?.id;
      }

      return NextResponse.json({ id: profileId });
    }

    // Get staff members (SECRETARY, LIBRARIAN)
    if (type === 'staff' && schoolId) {
      const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          OR: [{ roleschool: "SECRETARY" }, { roleschool: "LIBRARIAN" }],
          schoolId,
        },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          phone: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json(users);
    }

    // Get all users with filters
    const where: any = {};
    if (role) where.role = role;
    if (schoolId) where.schoolId = schoolId;

    // Default: get all SUPER_ADMIN users
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      where: Object.keys(where).length > 0 ? where : { role: "SUPER_ADMIN" },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// ==================== POST İŞLEMLERİ ====================


// ==================== POST İŞLEMLERİ ====================
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log("API - Received data:", data);

    // Check if the user already exists
    const existingEmail = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { data: null, error: "Email already exists" },
        { status: 409 }
      );
    }

    // Hash the Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with proper field mapping
    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        image: data.image,
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        // roleschool alanına yaz (SECRETARY veya LIBRARIAN)
        roleschool: data.role,
        // role alanı için varsayılan bir değer (UserRoleSchool enum'unda geçerli bir değer)
        role: "USER", // veya başka bir varsayılan değer
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        roleschool: true,
        image: true,
        schoolId: true,
        schoolName: true,
        createdAt: true,
      },
    });

    console.log(`User created successfully: ${newUser.name} (${newUser.id})`);
    
    return NextResponse.json(
      { data: newUser, error: null },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST user error:', error);
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}

// ==================== PUT İŞLEMLERİ (Güncelleme) ====================
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json() as Partial<UserCreateProps>;

    // If password is being updated, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        image: true,
        schoolId: true,
      },
    });

    return NextResponse.json({
      data: updatedUser,
      error: null,
    });
  } catch (error) {
    console.error('PUT user error:', error);
    return NextResponse.json(
      {
        data: null,
        error: 'Failed to update user',
      },
      { status: 500 }
    );
  }
}

// ==================== PATCH İŞLEMLERİ (Kısmi Güncelleme) ====================
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();

    const updatedUser = await db.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        image: true,
      },
    });

    return NextResponse.json({
      data: updatedUser,
      error: null,
    });
  } catch (error) {
    console.error('PATCH user error:', error);
    return NextResponse.json(
      {
        data: null,
        error: 'Failed to update user',
      },
      { status: 500 }
    );
  }
}

// ==================== DELETE İŞLEMLERİ ====================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete user and related records in transaction
    await db.$transaction([
      db.refreshToken.deleteMany({ where: { userId } }),
      db.user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json(
      {
        data: { message: 'User deleted successfully' },
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE user error:', error);
    return NextResponse.json(
      {
        data: null,
        error: 'Failed to delete user',
      },
      { status: 500 }
    );
  }
}