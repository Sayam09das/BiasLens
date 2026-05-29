import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "ops@biaslens.dev" },
    update: {},
    create: {
      email: "ops@biaslens.dev",
      fullName: "BiasLens Operations",
      role: "platform-admin",
      isActive: true,
    },
  });

  console.log("Production baseline seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
