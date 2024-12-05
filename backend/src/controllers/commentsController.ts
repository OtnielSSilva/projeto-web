import { RequestHandler } from "express";
import Comment from "../models/Comment";
import Game from "../models/Game";
import mongoose from "mongoose";

// Adicionar um comentário
export const addComment: RequestHandler = async (req, res, next) => {
  try {
    const gameIdParam = req.params.gameId;
    const gameId = parseInt(gameIdParam, 10); // Converter para número
    const { content } = req.body;
    const userId = req.user!.id; // Usando req.user do authMiddleware

    // Validar ID do jogo
    if (!gameId || isNaN(gameId)) {
      res
        .status(400)
        .json({ message: "ID de jogo inválido. Deve ser um número." });
      return;
    }

    // Verificar se o jogo existe
    const gameExists = await Game.exists({ appid: gameId });
    if (!gameExists) {
      res.status(404).json({ message: "Jogo não encontrado." });
      return;
    }

    // Verificar se o conteúdo está vazio
    if (!content || content.trim() === "") {
      res.status(400).json({ message: "O conteúdo do comentário é obrigatório." });
      return;
    }

    // Criar e salvar o comentário
    const comment = new Comment({
      user: userId,
      game: gameId,
      content,
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (error: any) {
    if (error.code === 11000) {
      // Erro de chave duplicada (violação do índice único)
      res.status(400).json({ message: "Você já comentou sobre este jogo." });
      return;
    }
    next(error);
  }
};

// Obter comentários de um jogo
export const getCommentsForGame: RequestHandler = async (req, res, next) => {
  try {
    const gameIdParam = req.params.gameId;
    const gameId = parseInt(gameIdParam, 10);

    // Validar ID do jogo
    if (!gameId || isNaN(gameId)) {
      res.status(400).json({ message: "ID de jogo inválido. Deve ser um número." });
      return;
    }

    // Buscar comentários pelo campo `game` numérico
    const comments = await Comment.find({ game: gameId })
      .populate("user", "name photoUrl")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error: any) {
    next(error);
  }
};

// Atualizar um comentário
export const updateComment: RequestHandler = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    // Validar ID do comentário
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json({ message: "ID de comentário inválido." });
      return;
    }

    // Encontrar o comentário
    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ message: "Comentário não encontrado." });
      return;
    }

    // Verificar se o comentário pertence ao usuário
    if (comment.user.toString() !== userId) {
      res
        .status(403)
        .json({ message: "Você só pode editar seus próprios comentários." });
      return;
    }

    // Atualizar o conteúdo
    if (!content || content.trim() === "") {
      res.status(400).json({ message: "O conteúdo do comentário é obrigatório." });
      return;
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (error: any) {
    next(error);
  }
};

// Excluir um comentário
export const deleteComment: RequestHandler = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user!.id;

    // Validar ID do comentário
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json({ message: "ID de comentário inválido." });
      return;
    }

    // Encontrar o comentário
    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ message: "Comentário não encontrado." });
      return;
    }

    // Verificar se o comentário pertence ao usuário
    if (comment.user.toString() !== userId) {
      res
        .status(403)
        .json({ message: "Você só pode excluir seus próprios comentários." });
      return;
    }

    await Comment.deleteOne({ _id: commentId });

    res.json({ message: "Comentário excluído com sucesso." });
  } catch (error: any) {
    next(error);
  }
};
