import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/auth";
import roleMiddleware from "../middleware/role";
import Game from "../models/Game";

const router = Router();

// Criar um novo jogo (somente admins)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const gameData = req.body;

    try {
      const newGame = new Game(gameData);
      await newGame.save();
      res.status(201).json(newGame);
    } catch (error) {
      console.error("Erro ao criar jogo:", error);
      next(error);
    }
  }
);

// Listar todos os jogos com filtros
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { genre, isFree, minAge, platform, minPrice, maxPrice } = req.query;

    try {
      const query: any = {};

      if (genre)
        query.genres = { $elemMatch: { description: genre as string } };
      if (isFree) query.is_free = isFree === "true";
      if (minAge) query.required_age = { $gte: Number(minAge) };
      if (platform) query[`platforms.${platform}`] = true;
      if (minPrice) query.price = { $gte: Number(minPrice) };
      if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

      const games = await Game.find(query);
      res.json(games);
    } catch (error) {
      console.error("Erro ao listar jogos:", error);
      next(error);
    }
  }
);

// Obter detalhes de um jogo específico
router.get(
  "/:appid",
  async (req: Request<{ appid: string }>, res: Response, next: NextFunction) => {
    const { appid } = req.params;

    try {
      const game = await Game.findOne({ appid: Number(appid) });
      if (!game) {
        res.status(404).json({ message: "Jogo não encontrado" });
        return;
      }

      res.json(game);
    } catch (error) {
      console.error("Erro ao buscar jogo:", error);
      next(error);
    }
  }
);

// Atualizar detalhes de um jogo (somente admins)
router.put(
  "/:appid",
  authMiddleware,
  roleMiddleware("admin"),
  async (
    req: Request<{ appid: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { appid } = req.params;
    const updateData = req.body;

    try {
      const game = await Game.findOneAndUpdate(
        { appid: Number(appid) },
        { $set: updateData },
        { new: true }
      );
      if (!game) {
        res.status(404).json({ message: "Jogo não encontrado" });
        return;
      }

      res.json(game);
    } catch (error) {
      console.error("Erro ao atualizar jogo:", error);
      next(error);
    }
  }
);

// Deletar um jogo (somente admins)
router.delete(
  "/:appid",
  authMiddleware,
  roleMiddleware("admin"),
  async (
    req: Request<{ appid: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { appid } = req.params;

    try {
      const game = await Game.findOneAndDelete({ appid: Number(appid) });
      if (!game) {
        res.status(404).json({ message: "Jogo não encontrado" });
        return;
      }

      res.json({ message: "Jogo deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar jogo:", error);
      next(error);
    }
  }
);

export default router;
