import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

const roleMiddleware = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== requiredRole) {
      res
        .status(403)
        .json({ message: "Acesso negado: Permissões insuficientes" });
      return;
    }
    next();
  };
};

export default roleMiddleware;
