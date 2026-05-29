import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  getUserController,
  updateUserController,
} from "./user.controller.js";

const router = Router();

router.get("/users/:id", requireAuth, getUserController);
router.patch("/users/:id", requireAuth, updateUserController);

export { router as userRoutes };
