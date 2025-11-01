import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all members with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { fatherName: { contains: search, mode: "insensitive" as const } },
            { houseName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.member.count({ where }),
    ]);

    return NextResponse.json({
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// POST create new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, fatherName, houseName, housePriority, familyMembers } = body;

    if (!name || !fatherName || !houseName) {
      return NextResponse.json(
        { error: "Name, Father Name, and House Name are required" },
        { status: 400 }
      );
    }

    const member = await prisma.member.create({
      data: {
        name,
        fatherName,
        houseName,
        housePriority: housePriority ? parseInt(housePriority) : 999,
        familyMembers: parseInt(familyMembers) || 1,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}

// PATCH update member (status or full details)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      status,
      name,
      fatherName,
      houseName,
      housePriority,
      familyMembers,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    // If only status is provided, update status
    if (status && !name && !fatherName && !houseName) {
      const member = await prisma.member.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json(member);
    }

    // Otherwise, update full member details
    if (!name || !fatherName || !houseName) {
      return NextResponse.json(
        { error: "Name, Father Name, and House Name are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      fatherName,
      houseName,
    };

    if (housePriority !== undefined) {
      updateData.housePriority = parseInt(housePriority);
    }

    if (familyMembers !== undefined) {
      updateData.familyMembers = parseInt(familyMembers);
    }

    const member = await prisma.member.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// DELETE member
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
