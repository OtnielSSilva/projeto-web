import GameCard from "@/components/GameCard";
import { IGame } from "@/types/game";

interface FavoritesProps {
  handleFav: (game: IGame) => Promise<void>;
  favs?: IGame[]; // Optional, defaults to an array
  handleAddToCart: (game: IGame) => Promise<void>;
  cartItems: { _id: string; game: IGame }[];
  handleRemoveFromCart: (cartItemId: string) => Promise<void>;
  libraryGames: IGame[];
}

export default function Favorites({
  handleFav = async () => {},
  favs = [], 
  handleAddToCart = async () => {},
  cartItems = [],
  handleRemoveFromCart = async () => {},
  libraryGames = [],
}: FavoritesProps) {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-white text-2xl font-semibold mb-4">My Favorites</h2>
      {Array.isArray(favs) && favs.length === 0 ? (
        <p className="text-gray-400 text-center text-lg font-medium mt-8">
          Você ainda não tem nenhum favorito. Adicione alguns jogos à sua lista
          de favoritos!
        </p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center sm:justify-center md:justify-start">
          {Array.isArray(favs) &&
            favs.map((game) =>
              game ? (
                <GameCard
                  key={game.appid}
                  game={game}
                  handleFav={handleFav}
                  favs={favs}
                  handleAddToCart={handleAddToCart}
                  cartItems={cartItems}
                  handleRemoveFromCart={handleRemoveFromCart}
                  libraryGames={libraryGames}
                />
              ) : null
            )}
        </div>
      )}
    </div>
  );
}
