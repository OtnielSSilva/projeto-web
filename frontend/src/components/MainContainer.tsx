import GameCard from "./GameCard";
import { IGame } from "../types/game";

interface MainContainerProps {
  games: IGame[];
  handleFav: (game: IGame) => Promise<void>;
  favs?: IGame[]; // Optional prop with a default value
  handleAddToCart: (game: IGame) => Promise<void>;
  cartItems?: { _id: string; game: IGame }[]; // Optional prop with a default value
  handleRemoveFromCart: (cartItemId: string) => Promise<void>;
  libraryGames?: IGame[]; // Optional prop with a default value
}

function MainContainer({
  games,
  handleFav,
  favs = [], // Default value as empty array
  handleAddToCart,
  cartItems = [], // Default value as empty array
  handleRemoveFromCart,
  libraryGames = [], // Default value as empty array
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
              handleFav={async () => {
                try {
                  await handleFav(game);
                } catch (err) {
                  console.error("Erro ao adicionar/remover favorito:", err);
                }
              }}
              favs={favs} // Ensure it receives a valid array
              handleAddToCart={async (game: IGame) => {
                try {
                  await handleAddToCart(game);
                } catch (err) {
                  console.error("Erro ao adicionar ao carrinho:", err);
                }
              }}
              cartItems={cartItems} // Ensure it receives a valid array
              handleRemoveFromCart={handleRemoveFromCart}
              libraryGames={libraryGames} // Ensure it receives a valid array
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MainContainer;
