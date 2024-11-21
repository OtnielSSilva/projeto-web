import axios from "axios";
import GameModel from "../models/gameModel";

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
    return apps.map((app: { appid: number }) => app.appid);
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
      { upsert: true } // Insere ou atualiza
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
    for (const appid of appids) {
      const details = await fetchGameDetails(appid);
      if (details) {
        await saveGameDetails(details);
      }
    }
    console.log("Todos os jogos foram processados e salvos.");
  } catch (error) {
    console.error("Erro ao processar os jogos:", error);
  }
};
