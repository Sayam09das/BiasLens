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
