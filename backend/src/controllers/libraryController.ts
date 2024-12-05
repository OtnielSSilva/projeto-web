import { RequestHandler } from "express";
import Library from "../models/Library";
import Game from "../models/Game";
import mongoose from "mongoose";

export const addToLibrary: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id; // User ID from authMiddleware
    const { gameId } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      res.status(404).json({ message: "Jogo não encontrado." });
      return;
    }

    let library = await Library.findOne({ userId });
    if (!library) {
      library = new Library({ userId, games: [gameId] });
    } else {
      if (!library.games.includes(gameId)) {
        library.games.push(gameId);
      } else {
        res.status(400).json({ message: "O jogo já está na biblioteca." });
        return;
      }
    }

    await library.save();
    res.status(200).json({ message: "Jogo adicionado à biblioteca.", library });
  } catch (error) {
    next(error);
  }
};

export const getLibrary: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id; // User ID from authMiddleware

    const library = await Library.findOne({ userId }).populate("games");
    if (!library) {
      res.status(404).json({ message: "Biblioteca não encontrada." });
      return;
    }

    res.status(200).json({ library });
  } catch (error) {
    next(error);
  }
};

export const removeFromLibrary: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user!.id; // User ID from authMiddleware
      const { gameId } = req.params;
  
      const library = await Library.findOne({ userId });
      if (!library) {
        res.status(404).json({ message: "Biblioteca não encontrada." });
        return;
      }
  
      // Convert gameId to ObjectId
      const gameObjectId = new mongoose.Types.ObjectId(gameId);
  
      // Find and remove the game from the library
      const gameIndex = library.games.findIndex(
        (game) => game.toString() === gameObjectId.toString()
      );
  
      if (gameIndex !== -1) {
        library.games.splice(gameIndex, 1);
        await library.save();
        res.status(200).json({ message: "Jogo removido da biblioteca.", library });
      } else {
        res.status(404).json({ message: "Jogo não encontrado na biblioteca." });
      }
    } catch (error) {
      next(error);
    }
  };