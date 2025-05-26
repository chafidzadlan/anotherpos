import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/neon/db";
import { users } from "@/lib/neon/schema";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      role: role || "cashier",
    }).returning();

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser[0].id, email: newUser[0].email, name: newUser[0].name, role: newUser[0].role } },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}