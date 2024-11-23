// Importar RequestHandler
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { CartItem } from '../models/CartItem';
import Game from '../models/Game';

// Adicionar item ao carrinho
export const addItemToCart: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { gameId } = req.body;

    // Verificar se o jogo existe
    const game = await Game.findById(gameId);
    if (!game) {
      res.status(404).json({ message: 'Jogo não encontrado' });
      return;
    }

    // Verificar se o item já está no carrinho
    let cartItem = await CartItem.findOne({ user: userId, game: gameId });
    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      cartItem = new CartItem({ user: userId, game: gameId });
      await cartItem.save();
    }

    res.status(200).json({ message: 'Item adicionado ao carrinho', cartItem });
  } catch (error) {
    next(error);
  }
};

// Obter itens do carrinho
export const getCartItems: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const cartItems = await CartItem.find({ user: userId }).populate('game');
    res.status(200).json({ cartItems });
  } catch (error) {
    next(error);
  }
};

// Remover item do carrinho
export const removeItemFromCart: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;

    const cartItem = await CartItem.findOneAndDelete({ _id: itemId, user: userId });
    if (!cartItem) {
      res.status(404).json({ message: 'Item do carrinho não encontrado' });
      return;
    }

    res.status(200).json({ message: 'Item removido do carrinho' });
  } catch (error) {
    next(error);
  }
};

// Atualizar quantidade do item no carrinho
export const updateCartItemQuantity: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      res.status(400).json({ message: 'Quantidade inválida' });
      return;
    }

    const cartItem = await CartItem.findOne({ _id: itemId, user: userId });
    if (!cartItem) {
      res.status(404).json({ message: 'Item do carrinho não encontrado' });
      return;
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Quantidade atualizada', cartItem });
  } catch (error) {
    next(error);
  }
};
