// src/routes/wishlist.ts
import { Router, Request, Response, NextFunction } from "express";
import authMiddleware, { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import Game from "../models/Game";
import mongoose from "mongoose";

const router = Router();

// Get user's wishlist
router.get(
  "/",
  authMiddleware,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await User.findById(req.user?.id).populate("wishlist");
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }

      res.json(user.wishlist);
    } catch (error) {
      console.error("Erro ao obter wishlist:", error);
      next(error);
    }
  }
);

// Add a game to wishlist
router.post(
  "/:gameId",
  authMiddleware,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { gameId } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(gameId)) {
        res.status(400).json({ message: "ID de jogo inválido" });
        return;
      }

      const gameObjectId = new mongoose.Types.ObjectId(gameId);

      const user = await User.findById(req.user?.id);
      const game = await Game.findById(gameObjectId);

      if (!user || !game) {
        res
          .status(404)
          .json({ message: "Usuário ou jogo não encontrado" });
        return;
      }

      if (user.wishlist.some((id) => id.equals(gameObjectId))) {
        res.status(400).json({ message: "Jogo já está na wishlist" });
        return;
      }

      user.wishlist.push(gameObjectId);
      await user.save();

      res.status(200).json({ message: "Jogo adicionado à wishlist" });
    } catch (error) {
      console.error("Erro ao adicionar jogo à wishlist:", error);
      next(error);
    }
  }
);

// Remove a game from wishlist
router.delete(
  "/:gameId",
  authMiddleware,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { gameId } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(gameId)) {
        res.status(400).json({ message: "ID de jogo inválido" });
        return;
      }

      const gameObjectId = new mongoose.Types.ObjectId(gameId);

      const user = await User.findById(req.user?.id);

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }

      if (!user.wishlist.some((id) => id.equals(gameObjectId))) {
        res.status(400).json({ message: "Jogo não está na wishlist" });
        return;
      }

      user.wishlist = user.wishlist.filter(
        (id) => !id.equals(gameObjectId)
      );
      await user.save();

      res.status(200).json({ message: "Jogo removido da wishlist" });
    } catch (error) {
      console.error("Erro ao remover jogo da wishlist:", error);
      next(error);
    }
  }
);

export default router;
