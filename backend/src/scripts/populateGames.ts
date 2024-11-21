import mongoose from "mongoose";
import dotenv from "dotenv";
import { processGames } from "../services/gameService";
import connectDB from "../config/database";

dotenv.config();

const start = async () => {
  try {
    // const mongoUri = process.env.MONGODB_URI!;
    // await mongoose.connect(mongoUri);
    // console.log("Conectado ao MongoDB!");
    connectDB();

    // console.log("Processando jogos...");
    await processGames();

    console.log("Processamento finalizado!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao processar os jogos:", error);
    process.exit(1);
  }
};

start();
