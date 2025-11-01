import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all donors
export async function GET() {
  try {
    const donors = await prisma.donor.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(donors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch donors" },
      { status: 500 }
    );
  }
}

// POST create new donor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, beef, lungs, bone } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const donor = await prisma.donor.create({
      data: {
        name,
        phone: phone || null,
        beef: parseFloat(beef) || 0,
        lungs: parseFloat(lungs) || 0,
        bone: parseFloat(bone) || 0,
      },
    });

    return NextResponse.json(donor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create donor" },
      { status: 500 }
    );
  }
}

// PATCH update donor
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, beef, lungs, bone } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Donor ID is required" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const donor = await prisma.donor.update({
      where: { id },
      data: {
        name,
        phone: phone || null,
        beef: parseFloat(beef) || 0,
        lungs: parseFloat(lungs) || 0,
        bone: parseFloat(bone) || 0,
      },
    });

    return NextResponse.json(donor);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update donor" },
      { status: 500 }
    );
  }
}

// DELETE donor
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Donor ID is required" },
        { status: 400 }
      );
    }

    await prisma.donor.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Donor deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete donor" },
      { status: 500 }
    );
  }
}
