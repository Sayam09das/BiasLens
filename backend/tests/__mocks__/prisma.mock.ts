export const prismaMock = {
  user: {
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
  },
  audit: {
    create: async () => null,
    findUnique: async () => null,
    findMany: async () => [],
  },
  report: {
    findUnique: async () => null,
    findMany: async () => [],
  },
  session: {
    create: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    deleteMany: async () => ({ count: 0 }),
  },
  auditLog: {
    create: async () => null,
    findUnique: async () => null,
    findMany: async () => [],
    count: async () => 0,
  },
};
