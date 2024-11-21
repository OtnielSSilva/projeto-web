import GameCard from "@/components/GameCard";
import { IGame } from "@/types/game";

interface FavoritesProps {
  handleFav: (game: IGame) => void;
  favs: IGame[];
}

export default function Favorites({ handleFav, favs }: FavoritesProps) {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-white text-2xl font-semibold mb-4">My Favorites</h2>
      {favs.length === 0 ? (
        <p className="text-gray-400 text-center text-lg font-medium mt-8">
          Você ainda não tem nenhum favorito. Adicione alguns jogos à sua lista
          de favoritos!
        </p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center sm:justify-center md:justify-start">
          {favs.map((game: IGame) => (
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
