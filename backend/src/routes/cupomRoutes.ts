import { Router } from "express";
import { validateCupom } from "../controllers/cupomController";

const router = Router();

router.post("/validate", validateCupom);

export default router;
