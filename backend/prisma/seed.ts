import { AuditStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@biaslens.dev" },
    update: {},
    create: {
      email: "demo@biaslens.dev",
      fullName: "Demo User",
      role: "admin",
    },
  });

  const audit = await prisma.audit.create({
    data: {
      title: "Demo Resume Audit",
      status: AuditStatus.COMPLETED,
      resumeText: "Demo full stack and ML hybrid resume",
      jobRole: "Full Stack Developer",
      userId: demoUser.id,
    },
  });

  await prisma.report.create({
    data: {
      title: "Demo Report",
      predictionLabel: "Hire",
      topProbability: 0.91,
      fairnessSnapshot: {
        overallSelectionRate: 0.4025,
      },
      auditId: audit.id,
      userId: demoUser.id,
    },
  });

  console.log("Development seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
