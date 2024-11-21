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
    const { title, genre, price, description, requirements } = req.body;

    try {
      const newGame = new Game({
        title,
        genre,
        price,
        description,
        requirements,
      });
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
    const { genre, minPrice, maxPrice } = req.query;

    try {
      const query: any = {};
      if (genre) query.genre = genre as string;
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
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const game = await Game.findById(id);
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

export default router;
