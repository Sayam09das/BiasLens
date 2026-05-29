import { Router } from "express";

const router = Router();

router.get("/reports/:id", (req, res) => {
  res.json({
    id: req.params.id,
    message: "Report read endpoint scaffolded.",
  });
});

router.get("/reports/:id/download", (req, res) => {
  res.json({
    id: req.params.id,
    message: "Report download endpoint scaffolded.",
  });
});

export { router as reportRoutes };
