import { RequestHandler } from "express";
import Cupom from "../models/Cupom";

export const validateCupom: RequestHandler = async (req, res, next) => {
  try {
    const { code } = req.body;

    const cupom = await Cupom.findOne({ code, isActive: true });
    if (!cupom) {
      res.status(404).json({ message: "Cupom inválido ou expirado." });
      return;
    }

    // Check expiration date (if applicable)
    if (cupom.expirationDate && new Date() > cupom.expirationDate) {
      res.status(400).json({ message: "Cupom expirado." });
      return;
    }

    res.status(200).json({ discount: cupom.discount });
  } catch (error) {
    next(error);
  }
};
