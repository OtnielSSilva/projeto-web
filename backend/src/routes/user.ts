import { Router } from "express";
import authMiddleware, { AuthRequest } from "../middleware/auth";
import roleMiddleware from "../middleware/role";

const router = Router();

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req: AuthRequest, res) => {
    res.json({ message: `Bem-vindo, admin ${req.user?.id}` });
  }
);

router.get("/profile", authMiddleware, (req: AuthRequest, res) => {
  res.json({ message: `Bem-vindo, user ${req.user?.id}` });
});

export default router;
