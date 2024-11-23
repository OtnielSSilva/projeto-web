import { Router, Request, Response } from "express";
import authMiddleware from "../middleware/auth";
import User from "../models/User";
import Game from "../models/Game";

const router = Router();

// Obter wishlist do usuário
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).populate("wishlist");
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    res.json(user.wishlist);
  } catch (error) {
    console.error("Erro ao obter wishlist:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Adicionar jogo à wishlist
router.post("/:appid", authMiddleware, async (req: Request, res: Response) => {
  const { appid } = req.params;

  try {
    if (isNaN(Number(appid))) {
      res.status(400).json({ message: "ID de jogo inválido" });
      return;
    }

    const user = await User.findById(req.user?.id);
    const game = await Game.findOne({ appid: Number(appid) });

    if (!user || !game) {
      res.status(404).json({ message: "Usuário ou jogo não encontrado" });
      return;
    }

    if (user.wishlist.some((id) => id.toString() === game.appid.toString())) {
      res.status(400).json({ message: "Jogo já está na wishlist" });
      return;
    }

    user.wishlist.push(game._id);
    await user.save();

    res.status(200).json({ message: "Jogo adicionado à wishlist" });
  } catch (error) {
    console.error("Erro ao adicionar jogo à wishlist:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Remover jogo da wishlist
router.delete("/:appid", authMiddleware, async (req: Request, res: Response) => {
  const { appid } = req.params;

  try {
    if (isNaN(Number(appid))) {
      res.status(400).json({ message: "ID de jogo inválido" });
      return;
    }

    const user = await User.findById(req.user?.id);
    const game = await Game.findOne({ appid: Number(appid) });

    if (!user || !game) {
      res.status(404).json({ message: "Usuário ou jogo não encontrado" });
      return;
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== game._id.toString()
    );
    await user.save();

    res.status(200).json({ message: "Jogo removido da wishlist" });
  } catch (error) {
    console.error("Erro ao remover jogo da wishlist:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

export default router;
