import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/neon/db";
import { users } from "@/lib/neon/schema";
import {
  validateAdmin,
  validateUserData,
  checkEmailExists,
  createErrorResponse,
  createSuccessResponse,
  type CreateUserData
} from "@/lib/api/user-validation";

// GET /api/admin/users
export async function GET() {
  try {
    const validation = await validateAdmin();
    if (validation.error) return validation.error;

    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users);

    return createSuccessResponse({ users: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST /api/admin/users
export async function POST(request: NextRequest) {
  try {
    const validation = await validateAdmin();
    if (validation.error) return validation.error;

    const body = await request.json();
    const dataValidation = validateUserData(body, false);

    if (!dataValidation.valid) {
      return createErrorResponse(dataValidation.error);
    }

    const userData = dataValidation.data as CreateUserData;

    // Check email uniqueness
    if (await checkEmailExists(userData.email)) {
      return createErrorResponse("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const newUser = await db.insert(users).values({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    }).returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    });

    return createSuccessResponse(
      { user: newUser[0] },
      "User created successfully",
      201
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return createErrorResponse("Internal server error", 500);
  }
}