import { Router, Request, Response } from "express";
import User from "../models/User";
import authMiddleware from "../middleware/auth";
import roleMiddleware from "../middleware/role";

const router = Router();

// Rota para admin
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req: Request, res: Response) => {
    res.json({ message: `Bem-vindo, admin ${req.user?.id}` });
  }
);

// Rota para perfil do usuário
router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const user = await User.findById(req.user.id).select(
      "name email photoUrl role wishlist"
    );

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl || "https://via.placeholder.com/150",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default router;
