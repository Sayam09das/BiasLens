import { auditSelect } from "../models/audit.model.js";
import { BaseRepository } from "./base.repository.js";

type AuditFilters = {
  status?: string;
  userId?: string;
};

export class AuditRepository extends BaseRepository {
  create(data: Parameters<typeof this.prisma.audit.create>[0]["data"]) {
    return this.run(() =>
      this.prisma.audit.create({
        data,
        select: auditSelect,
      })
    );
  }

  findById(id: string) {
    return this.run(() =>
      this.prisma.audit.findUnique({
        where: { id },
        select: auditSelect,
      })
    );
  }

  updateStatus(id: string, status: Parameters<typeof this.prisma.audit.update>[0]["data"]["status"]) {
    return this.run(() =>
      this.prisma.audit.update({
        where: { id },
        data: { status },
        select: auditSelect,
      })
    );
  }

  list(filters: AuditFilters = {}) {
    return this.run(() =>
      this.prisma.audit.findMany({
        where: {
          ...(filters.status ? { status: filters.status as never } : {}),
          ...(filters.userId ? { userId: filters.userId } : {}),
        },
        select: auditSelect,
        orderBy: { createdAt: "desc" },
      })
    );
  }
}

export const auditRepository = new AuditRepository();
