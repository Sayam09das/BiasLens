import { reportSelect } from "../models/report.model.js";
import { BaseRepository } from "./base.repository.js";

export class ReportRepository extends BaseRepository {
  findById(id: string) {
    return this.run(() =>
      this.prisma.report.findUnique({
        where: { id },
        select: reportSelect,
      })
    );
  }

  findByAuditId(auditId: string) {
    return this.run(() =>
      this.prisma.report.findUnique({
        where: { auditId },
        select: reportSelect,
      })
    );
  }

  create(data: Parameters<typeof this.prisma.report.create>[0]["data"]) {
    return this.run(() =>
      this.prisma.report.create({
        data,
        select: reportSelect,
      })
    );
  }

  listByUser(userId: string) {
    return this.run(() =>
      this.prisma.report.findMany({
        where: { userId },
        select: reportSelect,
        orderBy: { createdAt: "desc" },
      })
    );
  }
}

export const reportRepository = new ReportRepository();
