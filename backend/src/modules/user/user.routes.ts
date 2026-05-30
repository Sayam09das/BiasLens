import { Router } from "express";

import { authorizeSelfOrRole } from "../../middleware/authorization.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { authSchemas } from "../auth/auth.schemas.js";
import {
  getUserController,
  updateUserController,
} from "./user.controller.js";

const router = Router();

router.get(
  "/users/:id",
  requireAuth,
  validateRequest({ params: authSchemas.userParams }),
  authorizeSelfOrRole("id", "admin"),
  getUserController
);
router.patch(
  "/users/:id",
  requireAuth,
  validateRequest({
    params: authSchemas.userParams,
    body: authSchemas.updateUserBody,
  }),
  authorizeSelfOrRole("id", "admin"),
  updateUserController
);

export { router as userRoutes };
