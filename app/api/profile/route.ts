import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { db } from "@/lib/neon/db";
import { users } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 4;
};

interface UpdateProfileRequest {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    let body: UpdateProfileRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { name, email, currentPassword, newPassword } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change password" },
          { status: 400 }
        );
      }

      if (!validatePassword(newPassword)) {
        return NextResponse.json(
          { error: "New password must be at least 4 characters long" },
          { status: 400 }
        );
      }
    }

    const userId = parseInt(session.user.id);
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!currentUser.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = currentUser[0];

    if (email.trim() !== user.email) {
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email.trim()))
        .limit(1);

      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: "Email address is already in use" },
          { status: 409 }
        );
      }
    }

    const updateData: Partial<typeof users.$inferInsert> = {
      name: name.trim(),
      email: email.trim(),
      updatedAt: new Date(),
    };

    if (currentPassword && newPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    if (!updatedUser.length) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    console.log("Profile updated successfully:", updatedUser[0]);

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser[0],
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile update error:", error);

    if (error instanceof Error) {
      if (error.message.includes('unique constraint')) {
        return NextResponse.json(
          { error: "Email address is already in use" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const currentUser = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!currentUser.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user: currentUser[0] },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}