import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/neon/db";
import { users } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const VALID_ROLES = ["admin", "manager", "cashier", "inventory"] as const;
export const MIN_PASSWORD_LENGTH = 4;

// Types
export type UserRole = typeof VALID_ROLES[number];

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Validation Functions
export async function validateAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    };
  }

  return { session };
}

export function validateUserId(id: string): { error: string } | { userId: number } {
  const userId = parseInt(id);
  if (isNaN(userId) || userId <= 0) {
    return { error: "Invalid user ID" };
  }
  return { userId };
}

export function validateUserData(
  body: any,
  isUpdate = false
): { valid: false; error: string } | { valid: true; data: CreateUserData | UpdateUserData } {
  const { name, email, password, role } = body;

  // Validate name
  if (!name?.trim()) {
    return { valid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long" };
  }

  // Validate email
  if (!email?.trim()) {
    return { valid: false, error: "Email is required" };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, error: "Invalid email format" };
  }

  // Validate password
  if (!isUpdate && !password) {
    return { valid: false, error: "Password is required" };
  }

  if (password && password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    };
  }

  // Validate role
  if (!VALID_ROLES.includes(role)) {
    return { valid: false, error: "Invalid role" };
  }

  const validatedData = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    ...(password && { password })
  };

  return { valid: true, data: validatedData };
}

// Database Operations
export async function checkEmailExists(email: string, excludeId?: number): Promise<boolean> {
  try {
    const existingUsers = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (excludeId) {
      return existingUsers.some(user => user.id !== excludeId);
    }

    return existingUsers.length > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error("Database error while checking email");
  }
}

export async function findUserById(id: number) {
  try {
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return userList[0] || null;
  } catch (error) {
    console.error(`Error finding user by ID ${id}:`, error);
    throw new Error("Database error while finding user");
  }
}

export function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse(data: any, message?: string, status = 200) {
  return NextResponse.json({
    message,
    ...data
  }, { status });
}