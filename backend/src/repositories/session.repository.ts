import { sessionSelect } from "../models/session.model.js";
import { BaseRepository } from "./base.repository.js";

export class SessionRepository extends BaseRepository {
  create(data: Parameters<typeof this.prisma.session.create>[0]["data"]) {
    return this.run(() =>
      this.prisma.session.create({
        data,
        select: sessionSelect,
      })
    );
  }

  findActiveByUserId(userId: string) {
    return this.run(() =>
      this.prisma.session.findMany({
        where: {
          userId,
          expiresAt: {
            gt: new Date(),
          },
        },
        select: sessionSelect,
        orderBy: { createdAt: "desc" },
      })
    );
  }

  deleteByRefreshTokenHash(refreshTokenHash: string) {
    return this.run(() =>
      this.prisma.session.deleteMany({
        where: { refreshTokenHash },
      })
    );
  }
}

export const sessionRepository = new SessionRepository();
