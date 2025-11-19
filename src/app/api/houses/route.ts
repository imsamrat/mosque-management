import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all houses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const houses = await prisma.house.findMany({
      where: {
        mosqueId: session.user.mosqueId,
      },
      orderBy: {
        priority: "asc",
      },
    });

    return NextResponse.json(houses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch houses" },
      { status: 500 }
    );
  }
}

// POST create new house
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, priority } = body;

    if (!name) {
      return NextResponse.json(
        { error: "House name is required" },
        { status: 400 }
      );
    }

    const house = await prisma.house.create({
      data: {
        mosqueId: session.user.mosqueId,
        name,
        priority: priority ? parseInt(priority) : 999,
      },
    });

    return NextResponse.json(house, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create house" },
      { status: 500 }
    );
  }
}

// PATCH update house
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, priority } = body;

    if (!id) {
      return NextResponse.json(
        { error: "House ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingHouse = await prisma.house.findUnique({
      where: { id },
    });

    if (!existingHouse || existingHouse.mosqueId !== session.user.mosqueId) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    const house = await prisma.house.update({
      where: { id },
      data: {
        name,
        priority: priority ? parseInt(priority) : undefined,
      },
    });

    return NextResponse.json(house);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update house" },
      { status: 500 }
    );
  }
}

// DELETE house
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "House ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingHouse = await prisma.house.findUnique({
      where: { id },
    });

    if (!existingHouse || existingHouse.mosqueId !== session.user.mosqueId) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    await prisma.house.delete({
      where: { id },
    });

    return NextResponse.json({ message: "House deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete house" },
      { status: 500 }
    );
  }
}
