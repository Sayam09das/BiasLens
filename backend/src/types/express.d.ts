import type { AuthenticatedRequestUser } from "../middleware/auth/jwt.middleware.js";

declare module "express-serve-static-core" {
  interface Locals {
    authUser?: AuthenticatedRequestUser;
    requestId?: string;
  }
}

export {};
