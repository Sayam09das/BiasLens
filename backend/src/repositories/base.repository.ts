import { prisma } from "../config/prisma.js";

export abstract class BaseRepository {
  protected readonly prisma = prisma;

  protected async run<T>(operation: () => Promise<T>): Promise<T> {
    return operation();
  }
}
