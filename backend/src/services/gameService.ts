import axios from "axios";
import GameModel from "../models/Game";

const STEAM_LIST_API = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";
const STEAM_DETAILS_API =
  "https://store.steampowered.com/api/appdetails?appids=";

/**
 * Obtém a lista de jogos da Steam.
 */
export const fetchGameList = async (): Promise<number[]> => {
  try {
    const { data } = await axios.get(STEAM_LIST_API);
    const apps = data.applist.apps;
    return apps.map((app: { name: string; appid: number }) => app.name !== "" && app.appid);
  } catch (error) {
    console.error("Erro ao obter a lista de jogos:", error);
    throw error;
  }
};

/**
 * Obtém os detalhes de um jogo da Steam.
 */
export const fetchGameDetails = async (appid: number): Promise<any> => {
  try {
    const { data } = await axios.get(`${STEAM_DETAILS_API}${appid}`);
    if (data[appid]?.success) {
      return data[appid].data;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao obter detalhes do jogo ${appid}:`, error);
    return null;
  }
};

/**
 * Salva os detalhes do jogo no MongoDB.
 */
export const saveGameDetails = async (gameDetails: any): Promise<void> => {
  try {
    const {
      steam_appid,
      name,
      type,
      required_age,
      is_free,
      dlc,
      detailed_description,
      about_the_game,
      short_description,
      supported_languages,
      reviews,
      header_image,
      capsule_image,
      capsule_imagev5,
      website,
      pc_requirements,
      mac_requirements,
      linux_requirements,
      developers,
      publishers,
      packages,
      platforms,
      metacritic,
      categories,
      genres,
      screenshots,
      movies,
      recommendations,
      release_date,
      support_info,
      background,
      background_raw,
      content_descriptors,
      ratings,
    } = gameDetails;

    await GameModel.updateOne(
      { appid: steam_appid },
      {
        $set: {
          appid: steam_appid,
          name,
          type,
          required_age,
          is_free,
          dlc,
          detailed_description,
          about_the_game,
          short_description,
          supported_languages,
          reviews,
          header_image,
          capsule_image,
          capsule_imagev5,
          website,
          pc_requirements,
          mac_requirements,
          linux_requirements,
          developers,
          publishers,
          packages,
          platforms,
          metacritic,
          categories,
          genres,
          screenshots,
          movies,
          recommendations,
          release_date,
          support_info,
          background,
          background_raw,
          content_descriptors,
          ratings,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(
      `Erro ao salvar o jogo ${gameDetails.steam_appid} no banco:`,
      error
    );
  }
};

/**
 * Processa a lista de jogos, consulta os detalhes e salva no MongoDB.
 */
export const processGames = async (): Promise<void> => {
  try {
    const appids = await fetchGameList();

    const limitedAppIds = appids.slice(0, 50);

    for (const appid of limitedAppIds) {
      console.log(`Processando jogo com appid: ${appid}`);
      const details = await fetchGameDetails(appid);
      if (details) {
        await saveGameDetails(details);
        console.log(`Jogo ${appid} salvo com sucesso!`);
      } else {
        console.warn(`Detalhes não encontrados para o jogo ${appid}.`);
      }
    }

    console.log("Processamento dos finalizado.");
  } catch (error) {
    console.error("Erro ao processar os jogos:", error);
  }
};
