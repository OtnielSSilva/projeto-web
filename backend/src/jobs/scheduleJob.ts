import cron from "node-cron";
import { processGames } from "../services/gameService";

// Agendamento para rodar uma vez por mês
cron.schedule("0 0 1 * *", async () => {
  console.log("Iniciando o job mensal de atualização de jogos...");
  await processGames();
});
