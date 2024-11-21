import GameCard from "./GameCard";
import { IGame } from "../types/game";

interface MainContainerProps {
  games: IGame[];
  handleFav: (game: IGame) => void;
  favs: IGame[];
}

function MainContainer({
  games,
  handleFav,
  favs,
}: MainContainerProps): JSX.Element {
  return (
    <div className="container mx-auto p-4">
      {games.length === 0 ? (
        <div className="text-gray-400 text-center">
          <p>Não há jogos disponíveis no momento.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {games.map((game: IGame) => (
            <GameCard
              key={game.appid}
              game={game}
              handleFav={() => handleFav(game)}
              favs={favs}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MainContainer;
