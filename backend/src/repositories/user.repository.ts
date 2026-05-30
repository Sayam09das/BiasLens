import { userSelect } from "../models/user.model.js";
import { BaseRepository } from "./base.repository.js";

export class UserRepository extends BaseRepository {
  findById(id: string) {
    return this.run(() =>
      this.prisma.user.findUnique({
        where: { id },
        select: userSelect,
      })
    );
  }

  findByEmail(email: string) {
    return this.run(() =>
      this.prisma.user.findUnique({
        where: { email },
      })
    );
  }

  create(data: Parameters<typeof this.prisma.user.create>[0]["data"]) {
    return this.run(() =>
      this.prisma.user.create({
        data,
        select: userSelect,
      })
    );
  }

  update(id: string, data: Parameters<typeof this.prisma.user.update>[0]["data"]) {
    return this.run(() =>
      this.prisma.user.update({
        where: { id },
        data,
        select: userSelect,
      })
    );
  }
}

export const userRepository = new UserRepository();
