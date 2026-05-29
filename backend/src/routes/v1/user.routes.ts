import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/users/:id", (req, res) => {
  res.json({
    id: req.params.id,
    message: "User read endpoint scaffolded.",
  });
});

router.patch("/users/:id", (req, res) => {
  res.status(StatusCodes.ACCEPTED).json({
    id: req.params.id,
    updates: req.body,
    message: "User update endpoint scaffolded.",
  });
});

export { router as userRoutes };
