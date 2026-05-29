import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.post("/login", (_req, res) => {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({
    message: "Login flow is scaffolded but not implemented yet.",
  });
});

router.post("/register", (_req, res) => {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({
    message: "Registration flow is scaffolded but not implemented yet.",
  });
});

router.post("/logout", (_req, res) => {
  res.status(StatusCodes.NO_CONTENT).send();
});

export { router as authRoutes };
