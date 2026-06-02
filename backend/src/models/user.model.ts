import { Prisma, type User } from "@prisma/client";

export type UserModel = User;
export type CreateUserInput = Prisma.UserCreateInput;
export type UpdateUserInput = Prisma.UserUpdateInput;

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  fullName: true,
  role: true,
  jobTitle: true,
  company: true,
  phoneNumber: true,
  settings: true,
  isActive: true,
  emailVerified: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
});
