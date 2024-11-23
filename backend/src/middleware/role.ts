import { Request, Response, NextFunction } from "express";


const roleMiddleware = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
