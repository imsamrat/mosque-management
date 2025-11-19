import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all members with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: any = {
      mosqueId: session.user.mosqueId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { fatherName: { contains: search, mode: "insensitive" as const } },
        { houseName: { contains: search, mode: "insensitive" as const } },
      ];
    }

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, fatherName, houseId, houseName, housePriority, familyMembers } = body;

    if (!name || !fatherName) {
      return NextResponse.json(
        { error: "Name and Father Name are required" },
        { status: 400 }
      );
    }

    if (!houseId && !houseName) {
      return NextResponse.json(
        { error: "House is required" },
        { status: 400 }
      );
    }

    let finalHouseName = houseName;
    let finalHousePriority = housePriority ? parseInt(housePriority) : 999;

    // If houseId is provided, fetch house details to populate redundant fields if needed
    if (houseId) {
      const house = await prisma.house.findUnique({ where: { id: houseId } });
      if (house) {
        finalHouseName = house.name;
        finalHousePriority = house.priority;
      }
    }

    const member = await prisma.member.create({
      data: {
        mosqueId: session.user.mosqueId,
        name,
        fatherName,
        houseId,
        houseName: finalHouseName,
        housePriority: finalHousePriority,
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Verify ownership
    const existingMember = await prisma.member.findUnique({
      where: { id },
    });

    if (!existingMember || existingMember.mosqueId !== session.user.mosqueId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingMember = await prisma.member.findUnique({
      where: { id },
    });

    if (!existingMember || existingMember.mosqueId !== session.user.mosqueId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
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
