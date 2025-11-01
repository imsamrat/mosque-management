import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with dummy data...");

  // Clear existing data
  await prisma.slideShow.deleteMany();
  await prisma.member.deleteMany();
  await prisma.donor.deleteMany();

  // Create Donors with dummy data
  const donors = await Promise.all([
    prisma.donor.create({
      data: {
        name: "Ahmed Ali",
        phone: "0300-1234567",
        beef: 25000, // 25 kg in grams
        lungs: 2000, // 2 kg in grams
        bone: 3000, // 3 kg in grams
      },
    }),
    prisma.donor.create({
      data: {
        name: "Mohammad Hussain",
        phone: "0321-9876543",
        beef: 30000, // 30 kg
        lungs: 2500, // 2.5 kg
        bone: 3500, // 3.5 kg
      },
    }),
    prisma.donor.create({
      data: {
        name: "Fatima Bibi",
        phone: "0333-4567890",
        beef: 20000, // 20 kg
        lungs: 1800, // 1.8 kg
        bone: 2500, // 2.5 kg
      },
    }),
    prisma.donor.create({
      data: {
        name: "Hassan Khan",
        phone: "0345-1112233",
        beef: 35000, // 35 kg
        lungs: 3000, // 3 kg
        bone: 4000, // 4 kg
      },
    }),
    prisma.donor.create({
      data: {
        name: "Ayesha Malik",
        phone: "0312-5556677",
        beef: 28000, // 28 kg
        lungs: 2200, // 2.2 kg
        bone: 3200, // 3.2 kg
      },
    }),
  ]);

  console.log(`✅ Created ${donors.length} donors`);

  // Create Members with dummy data
  const members = await Promise.all([
    prisma.member.create({
      data: {
        name: "Abdul Rahman",
        fatherName: "Abdul Aziz",
        houseName: "House #1, Street 5",
        familyMembers: 5,
        status: "PENDING",
      },
    }),
    prisma.member.create({
      data: {
        name: "Usman Farooq",
        fatherName: "Farooq Ahmed",
        houseName: "House #12, Green Block",
        familyMembers: 4,
        status: "PENDING",
      },
    }),
    prisma.member.create({
      data: {
        name: "Bilal Ahmad",
        fatherName: "Ahmad Ali",
        houseName: "House #7, Main Road",
        familyMembers: 6,
        status: "PENDING",
      },
    }),
    prisma.member.create({
      data: {
        name: "Hamza Raza",
        fatherName: "Raza Hussain",
        houseName: "House #23, Model Town",
        familyMembers: 3,
        status: "PENDING",
      },
    }),
    prisma.member.create({
      data: {
        name: "Ibrahim Sheikh",
        fatherName: "Sheikh Mohammad",
        houseName: "House #45, Park View",
        familyMembers: 7,
        status: "PENDING",
      },
    }),
    prisma.member.create({
      data: {
        name: "Yusuf Khan",
        fatherName: "Khan Sahib",
        houseName: "House #8, Saddar",
        familyMembers: 4,
        status: "PENDING",
      },
    }),
    prisma.member.create({
      data: {
        name: "Omar Abdullah",
        fatherName: "Abdullah Jan",
        houseName: "House #19, Colony",
        familyMembers: 5,
        status: "PENDING",
      },
    }),
    prisma.member.create({
      data: {
        name: "Salman Haider",
        fatherName: "Haider Ali",
        houseName: "House #31, Gulshan",
        familyMembers: 6,
        status: "PENDING",
      },
    }),
    prisma.member.create({
      data: {
        name: "Zain Abbas",
        fatherName: "Abbas Ali",
        houseName: "House #14, Clifton",
        familyMembers: 3,
        status: "PENDING",
      },
    }),
    prisma.member.create({
      data: {
        name: "Talha Mehmood",
        fatherName: "Mehmood Khan",
        houseName: "House #27, DHA",
        familyMembers: 5,
        status: "PENDING",
      },
    }),
  ]);

  console.log(`✅ Created ${members.length} members`);

  // Calculate total donations
  const totalBeef = donors.reduce((sum, d) => sum + d.beef, 0);
  const totalLungs = donors.reduce((sum, d) => sum + d.lungs, 0);
  const totalBone = donors.reduce((sum, d) => sum + d.bone, 0);

  // Calculate total family members
  const totalFamilyMembers = members.reduce(
    (sum, m) => sum + m.familyMembers,
    0
  );

  // Calculate per-person shares
  const beefPerPerson = totalBeef / totalFamilyMembers;
  const lungsPerPerson = totalLungs / totalFamilyMembers;
  const bonePerPerson = totalBone / totalFamilyMembers;

  // Update each member with their calculated shares
  await Promise.all(
    members.map((member) =>
      prisma.member.update({
        where: { id: member.id },
        data: {
          beefShare: beefPerPerson * member.familyMembers,
          lungsShare: lungsPerPerson * member.familyMembers,
          boneShare: bonePerPerson * member.familyMembers,
          status: "COMPLETED",
        },
      })
    )
  );

  console.log("✅ Updated member shares with distribution calculation");

  console.log("\n📊 Summary:");
  console.log(`   Total Beef: ${(totalBeef / 1000).toFixed(2)} kg`);
  console.log(`   Total Lungs: ${(totalLungs / 1000).toFixed(2)} kg`);
  console.log(`   Total Bone: ${(totalBone / 1000).toFixed(2)} kg`);
  console.log(`   Total Family Members: ${totalFamilyMembers}`);
  console.log(`   Per Person - Beef: ${(beefPerPerson / 1000).toFixed(2)} kg`);
  console.log(
    `   Per Person - Lungs: ${(lungsPerPerson / 1000).toFixed(2)} kg`
  );
  console.log(`   Per Person - Bone: ${(bonePerPerson / 1000).toFixed(2)} kg`);
  console.log("\n✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
