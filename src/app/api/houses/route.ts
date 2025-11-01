import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all unique houses with member counts and priorities
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      select: {
        houseName: true,
        housePriority: true,
      },
    });

    // Group by house name
    const housesMap = new Map<
      string,
      { housePriority: number; count: number }
    >();

    members.forEach((member) => {
      const existing = housesMap.get(member.houseName);
      if (existing) {
        existing.count++;
        // Take the minimum priority (most members will have same priority)
        existing.housePriority = Math.min(
          existing.housePriority,
          member.housePriority
        );
      } else {
        housesMap.set(member.houseName, {
          housePriority: member.housePriority,
          count: 1,
        });
      }
    });

    // Convert to array and sort by priority
    const houses = Array.from(housesMap.entries())
      .map(([houseName, data]) => ({
        houseName,
        housePriority: data.housePriority,
        memberCount: data.count,
      }))
      .sort((a, b) => {
        if (a.housePriority !== b.housePriority) {
          return a.housePriority - b.housePriority;
        }
        return a.houseName.localeCompare(b.houseName);
      });

    return NextResponse.json(houses);
  } catch (error) {
    console.error("Error fetching houses:", error);
    return NextResponse.json(
      { error: "Failed to fetch houses" },
      { status: 500 }
    );
  }
}

// PATCH - Update house priority (updates all members from that house)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { houseName, housePriority } = body;

    if (!houseName) {
      return NextResponse.json(
        { error: "House name is required" },
        { status: 400 }
      );
    }

    const priority = parseInt(housePriority) || 999;

    // Update all members from this house
    const result = await prisma.member.updateMany({
      where: {
        houseName: houseName,
      },
      data: {
        housePriority: priority,
      },
    });

    return NextResponse.json({
      success: true,
      houseName,
      housePriority: priority,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Error updating house priority:", error);
    return NextResponse.json(
      { error: "Failed to update house priority" },
      { status: 500 }
    );
  }
}
