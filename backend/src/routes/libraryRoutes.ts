import { Router } from "express";
import {
  addToLibrary,
  getLibrary,
  removeFromLibrary,
} from "../controllers/libraryController";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/add", authMiddleware, addToLibrary);
router.get("/", authMiddleware, getLibrary);
router.delete("/:gameId", authMiddleware, removeFromLibrary);

export default router;
