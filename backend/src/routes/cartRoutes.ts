// routes/cartRoutes.ts
import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import {
  addItemToCart,
  getCartItems,
  removeItemFromCart,
  updateCartItemQuantity,
  checkout,
} from '../controllers/cartController';

const router = Router();

// Adicionar item ao carrinho
router.post('/', authMiddleware, addItemToCart);

// Obter itens do carrinho
router.get('/', authMiddleware, getCartItems);

// Atualizar quantidade do item no carrinho
router.put('/:itemId', authMiddleware, updateCartItemQuantity);

// Remover item do carrinho
router.delete('/:itemId', authMiddleware, removeItemFromCart);

// Checkout
router.post("/checkout", authMiddleware, checkout);

export default router;
