import type { Prisma, User } from "@prisma/client";

export type UserModel = User;
export type CreateUserInput = Prisma.UserCreateInput;
export type UpdateUserInput = Prisma.UserUpdateInput;

export const userSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  jobTitle: true,
  company: true,
  phoneNumber: true,
  isActive: true,
  emailVerified: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;
