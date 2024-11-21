import { useNavigate } from "react-router-dom";
import { IGame } from "../types/game"; // Atualize o path conforme sua estrutura
import { IoHeartSharp, IoHeartOutline } from "react-icons/io5";
import { IconContext } from "react-icons";

interface GameCardProps {
  game: IGame;
  favs: IGame[];
  handleFav: (game: IGame) => void;
}

const GameCard = ({ game, favs, handleFav }: GameCardProps): JSX.Element => {
  const navigate = useNavigate();
  const isFavorite = favs.some((fav) => fav.appid === game.appid);

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer relative w-64"
      onClick={() => navigate(`/game/${game.appid}`)}
    >
      <img
        src={game.header_image}
        alt={`${game.name} poster`}
        className="w-full object-cover max-h-80"
      />
      <div className="p-4">
        <h3
          className="text-white text-base sm:text-base md:text-lg lg:text-xl xl:text-xl font-semibold mb-2 truncate"
          title={game.name}
        >
          {game.name}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base line-clamp-3">
          {game.release_date?.date || "Data de lançamento não disponível"}
        </p>
        <p className="text-gray-500 text-xs mt-1 truncate">
          {game.developers?.join(", ") || "Desenvolvedor não disponível"}
        </p>
      </div>

      <div
        className="absolute top-2 right-2 p-2 rounded-full bg-gray-900 hover:bg-gray-700"
        onClick={(e) => {
          e.stopPropagation();
          handleFav(game);
        }}
      >
        <IconContext.Provider value={{ size: "1.5em", color: "red" }}>
          {isFavorite ? <IoHeartSharp /> : <IoHeartOutline />}
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default GameCard;
