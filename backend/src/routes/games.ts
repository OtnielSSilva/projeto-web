import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/auth";
import roleMiddleware from "../middleware/role";
import Game from "../models/Game";

const router = Router();

/**
 * Helper para validar o parâmetro appid
 * Retorna o número convertido ou null se for inválido
 */
const validateAppId = (appid: string): number | null => {
  const parsedAppId = Number(appid);
  return !isNaN(parsedAppId) && parsedAppId > 0 ? parsedAppId : null;
};

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

      // Filtrar por gênero
      if (genre) query.genres = { $elemMatch: { description: genre as string } };

      // Filtrar por jogos gratuitos
      if (isFree) query.is_free = isFree === "true";

      // Filtrar por idade mínima
      if (minAge && !isNaN(Number(minAge))) query.required_age = { $gte: Number(minAge) };

      // Filtrar por plataforma
      if (platform) query[`platforms.${platform}`] = true;

      // Filtrar por preço mínimo e máximo
      if (minPrice && !isNaN(Number(minPrice))) query.price = { $gte: Number(minPrice) };
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.price = { ...query.price, $lte: Number(maxPrice) };
      }

      const games = await Game.find(query);
      res.json(games);
    } catch (error) {
      console.error("Erro ao listar jogos:", error);
      next(error);
    }
  }
);

// Obter jogos destacados para o carrossel
router.get(
  "/featured",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const featuredGames = await Game.aggregate([
        { $match: { header_image: { $exists: true, $ne: null } } },
        { $sample: { size: 3 } },
        { $project: { header_image: 1, name: 1, _id: 0 } },
      ]);

      if (!featuredGames || featuredGames.length === 0) {
        res.status(404).json({ message: "Nenhum jogo encontrado para o carrossel." });
        return;
      }

      res.status(200).json(featuredGames);
    } catch (error) {
      console.log("Alo")
      console.error("Erro ao buscar jogos destacados:", error);
      next(error);
    }
  }
);

// Obter detalhes de um jogo específico
router.get(
  "/:appid",
  async (
    req: Request<{ appid: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const appid = validateAppId(req.params.appid);
    if (!appid) {
      res.status(400).json({ message: "O parâmetro appid deve ser um número válido." });
      return;
    }

    try {
      const game = await Game.findOne({ appid });
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
    const appid = validateAppId(req.params.appid);
    if (!appid) {
      res.status(400).json({ message: "O parâmetro appid deve ser um número válido." });
      return;
    }

    try {
      const game = await Game.findOneAndUpdate(
        { appid },
        { $set: req.body },
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
    const appid = validateAppId(req.params.appid);
    if (!appid) {
      res.status(400).json({ message: "O parâmetro appid deve ser um número válido." });
      return;
    }

    try {
      const game = await Game.findOneAndDelete({ appid });
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
