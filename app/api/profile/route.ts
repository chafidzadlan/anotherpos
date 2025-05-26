import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { db } from "@/lib/neon/db";
import { users } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email, currentPassword, newPassword } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(session.user.id)))
      .limit(1);

    if (!currentUser.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = currentUser[0];

    if (email !== user.email) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      name,
      email,
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
      .where(eq(users.id, parseInt(session.user.id)))
      .returning();

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser[0].id,
          email: updatedUser[0].email,
          name: updatedUser[0].name,
          role: updatedUser[0].role
        }
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}