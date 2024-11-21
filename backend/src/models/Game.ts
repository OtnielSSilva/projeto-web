import mongoose, { Document } from "mongoose";

export interface IGame extends Document {
  title: string;
  genre: string;
  price: number;
  description: string;
  requirements: string;
}

const gameSchema = new mongoose.Schema<IGame>({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
});

const Game = mongoose.model<IGame>("Game", gameSchema);
export default Game;
