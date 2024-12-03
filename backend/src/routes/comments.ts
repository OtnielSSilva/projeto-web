import express from "express";
import { body } from 'express-validator';
import {
  addComment,
  getCommentsForGame,
  updateComment,
  deleteComment,
} from "../controllers/commentsController";
import authMiddleware from "../middleware/auth"; 

const router = express.Router();

// Adicionar um comentário a um jogo
router.post(
    '/games/:gameId/comments',
    authMiddleware,
    [
      body('content')
        .trim()
        .notEmpty()
        .withMessage('O conteúdo do comentário é obrigatório.')
        .isLength({ max: 500 })
        .withMessage('O comentário deve ter no máximo 500 caracteres.'),
    ],
    addComment
  );

// Obter comentários de um jogo
router.get("/games/:gameId/comments", getCommentsForGame);

// Atualizar um comentário
router.put("/comments/:commentId", authMiddleware, updateComment);

// Excluir um comentário
router.delete("/comments/:commentId", authMiddleware, deleteComment);

export default router;
