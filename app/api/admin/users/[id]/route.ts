import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/neon/db";
import { users } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";
import {
  validateAdmin,
  validateUserId,
  validateUserData,
  findUserById,
  checkEmailExists,
  createErrorResponse,
  createSuccessResponse,
  type UpdateUserData
} from "@/lib/api/user-validation";

// PUT /api/admin/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validation = await validateAdmin();
    if (validation.error) return validation.error;

    const idValidation = validateUserId(params.id);
    if ("error" in idValidation) {
      return createErrorResponse(idValidation.error);
    }

    const { userId } = idValidation;

    // Check if user exists
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      return createErrorResponse("User not found", 404);
    }

    const body = await request.json();
    const dataValidation = validateUserData(body, true);

    if (!dataValidation.valid) {
      return createErrorResponse(dataValidation.error);
    }

    const userData = dataValidation.data as UpdateUserData;

    // Check email uniqueness (excluding current user)
    if (await checkEmailExists(userData.email, userId)) {
      return createErrorResponse("Email already registered");
    }

    // Prepare update data
    const updateData: any = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      updatedAt: new Date(),
    };

    // Hash new password if provided
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 12);
    }

    // Update user
    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (updatedUser.length === 0) {
      return createErrorResponse("Failed to update user", 500);
    }

    return createSuccessResponse(
      { user: updatedUser[0] },
      "User updated successfully"
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validation = await validateAdmin();
    if (validation.error) return validation.error;

    const { session } = validation;

    const idValidation = validateUserId(params.id);
    if ("error" in idValidation) {
      return createErrorResponse(idValidation.error);
    }

    const { userId } = idValidation;

    // Prevent self-deletion
    if (session.user.id === userId.toString()) {
      return createErrorResponse("You cannot delete your own account");
    }

    // Check if user exists
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      return createErrorResponse("User not found", 404);
    }

    // Delete user
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    if (deletedUser.length === 0) {
      return createErrorResponse("Failed to delete user", 500);
    }

    return createSuccessResponse(
      { deletedUser: deletedUser[0] },
      "User deleted successfully"
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return createErrorResponse("Internal server error", 500);
  }
}