import express from "express";
import {
  addComment,
  getCommentsForGame,
  updateComment,
  deleteComment,
} from "../controllers/commentsController";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// Adicionar um comentário a um jogo
router.post("/:gameId/comments", authMiddleware, addComment);

// Obter comentários de um jogo
router.get("/:gameId/comments", getCommentsForGame);

// Atualizar um comentário
router.put("/:commentId", authMiddleware, updateComment);

// Excluir um comentário
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
