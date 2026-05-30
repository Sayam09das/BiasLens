import { BaseRepository } from "./base.repository.js";

export class AnalyticsRepository extends BaseRepository {
  async getAdminDashboardSnapshot() {
    const [users, audits, reports, auditLogs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.audit.count(),
      this.prisma.report.count(),
      this.prisma.auditLog.count(),
    ]);

    return {
      users,
      audits,
      reports,
      auditLogs,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
