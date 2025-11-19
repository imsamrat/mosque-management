import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { mosqueName, mosqueAddress, adminName, email, password } = await req.json();

    if (!mosqueName || !adminName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Mosque and User transaction
    const result = await prisma.$transaction(async (tx) => {
      const mosque = await tx.mosque.create({
        data: {
          name: mosqueName,
          address: mosqueAddress,
        },
      });

      const user = await tx.user.create({
        data: {
          name: adminName,
          email,
          password: hashedPassword,
          mosqueId: mosque.id,
        },
      });

      return { mosque, user };
    });

    return NextResponse.json(
      { message: "Registration successful", user: result.user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
