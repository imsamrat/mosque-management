import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Calculate and distribute shares
export async function POST() {
  try {
    // Get all donors
    const donors = await prisma.donor.findMany();

    // Calculate totals in grams
    const totalBeef = donors.reduce(
      (sum: number, donor: any) => sum + donor.beef,
      0
    );
    const totalLungs = donors.reduce(
      (sum: number, donor: any) => sum + donor.lungs,
      0
    );
    const totalBone = donors.reduce(
      (sum: number, donor: any) => sum + donor.bone,
      0
    );

    // Get all members
    const members = await prisma.member.findMany();

    if (members.length === 0) {
      return NextResponse.json(
        { error: "No members found. Please add members first." },
        { status: 400 }
      );
    }

    // Calculate total family members (sum of all familyMembers)
    const totalFamilyMembers = members.reduce(
      (sum: number, member: any) => sum + member.familyMembers,
      0
    );

    // Calculate per person share (in grams)
    const beefPerPerson = totalBeef / totalFamilyMembers;
    const lungsPerPerson = totalLungs / totalFamilyMembers;
    const bonePerPerson = totalBone / totalFamilyMembers;

    // Update all members with calculated shares (multiplied by their family members)
    await prisma.$transaction(
      members.map((member: any) =>
        prisma.member.update({
          where: { id: member.id },
          data: {
            beefShare: parseFloat(
              (beefPerPerson * member.familyMembers).toFixed(2)
            ),
            lungsShare: parseFloat(
              (lungsPerPerson * member.familyMembers).toFixed(2)
            ),
            boneShare: parseFloat(
              (bonePerPerson * member.familyMembers).toFixed(2)
            ),
            status: "COMPLETED",
          },
        })
      )
    );

    return NextResponse.json({
      message: "Distribution calculated successfully",
      totals: {
        beef: totalBeef,
        lungs: totalLungs,
        bone: totalBone,
      },
      perPerson: {
        beef: parseFloat(beefPerPerson.toFixed(2)),
        lungs: parseFloat(lungsPerPerson.toFixed(2)),
        bone: parseFloat(bonePerPerson.toFixed(2)),
      },
      totalFamilyMembers,
      totalMembers: members.length,
    });
  } catch (error) {
    console.error("Distribution error:", error);
    return NextResponse.json(
      { error: "Failed to calculate distribution" },
      { status: 500 }
    );
  }
}

// GET - Get distribution summary
export async function GET() {
  try {
    const donors = await prisma.donor.findMany();
    const members = await prisma.member.findMany();

    const totalBeef = donors.reduce(
      (sum: number, donor: any) => sum + donor.beef,
      0
    );
    const totalLungs = donors.reduce(
      (sum: number, donor: any) => sum + donor.lungs,
      0
    );
    const totalBone = donors.reduce(
      (sum: number, donor: any) => sum + donor.bone,
      0
    );

    const totalMembers = members.length;
    const totalFamilyMembers = members.reduce(
      (sum: number, member: any) => sum + member.familyMembers,
      0
    );
    const completedMembers = members.filter(
      (m: any) => m.status === "COMPLETED"
    ).length;
    const pendingMembers = members.filter(
      (m: any) => m.status === "PENDING"
    ).length;

    return NextResponse.json({
      totals: {
        beef: totalBeef,
        lungs: totalLungs,
        bone: totalBone,
      },
      statistics: {
        totalDonors: donors.length,
        totalMembers,
        totalFamilyMembers,
        completedMembers,
        pendingMembers,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch distribution summary" },
      { status: 500 }
    );
  }
}
