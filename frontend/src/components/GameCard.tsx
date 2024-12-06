import { useNavigate } from "react-router-dom";
import { IGame } from "../types/game";
import { IoHeartSharp, IoHeartOutline } from "react-icons/io5";
import { IconContext } from "react-icons";

interface GameCardProps {
  game: IGame;
  favs?: IGame[]; // Agora opcional
  cartItems?: { _id: string; game: IGame | null }[]; // Agora opcional
  handleFav?: (game: IGame) => Promise<void>; // Agora opcional
  handleAddToCart?: (game: IGame) => Promise<void>; // Agora opcional
  handleRemoveFromCart?: (cartItemId: string) => Promise<void>; // Agora opcional
  libraryGames?: IGame[]; // Agora opcional
}

const GameCard = ({
  game,
  favs = [], // Valor padrão como array vazio
  cartItems = [], // Valor padrão como array vazio
  handleFav = async () => Promise.resolve(), // Função padrão vazia
  handleAddToCart = async () => Promise.resolve(), // Função padrão vazia
  handleRemoveFromCart = async () => Promise.resolve(), // Função padrão vazia
  libraryGames = [], // Valor padrão como array vazio
}: GameCardProps): JSX.Element => {
  const navigate = useNavigate();

  // Verifica se o jogo está na lista de desejos (favs)
  const isFavorite = favs.some((fav) => fav.appid === game.appid);

  // Verifica se o jogo está no carrinho
  const isInCart = cartItems.some(
    (item) => item.game && item.game._id === game._id
  );

  // Verifica se o jogo está na biblioteca
  const isInLibrary = libraryGames.some(
    (libraryGame) => libraryGame._id === game._id
  );

  // Define o preço a ser exibido
  const priceDisplay = game.is_free
    ? "FREE"
    : game.price_overview?.final_formatted || "FREE";

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
        <p className="text-green-500 text-lg font-bold mt-2">{priceDisplay}</p>
      </div>

      {/* Botão de Favoritos */}
      {!isInLibrary && (
        <div
        className="absolute top-2 right-2 p-2 rounded-full bg-gray-900 hover:bg-gray-700"
        onClick={async (e) => {
          e.stopPropagation();
          try {
            await handleFav(game); // Espere a promessa resolver
          } catch (err) {
            console.error("Erro ao favoritar jogo:", err);
          }
        }}
      >
        <IconContext.Provider value={{ size: "1.5em", color: "red" }}>
          {isFavorite ? <IoHeartSharp /> : <IoHeartOutline />}
        </IconContext.Provider>
      </div>
      )}

      {/* Botão Dinâmico de Carrinho ou Biblioteca */}
      {isInLibrary ? (
        <div className="w-full py-2 mt-4 rounded-b text-center text-gray-400 font-bold bg-gray-700">
          Adicionado à Biblioteca
        </div>
      ) : (
        <button
          className={`w-full py-2 mt-4 rounded-b text-white font-bold ${
            isInCart
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={async (e) => {
            e.stopPropagation();
            try {
              if (isInCart) {
                const cartItem = cartItems.find(
                  (item) => item.game && item.game._id === game._id
                );
                if (cartItem) {
                  await handleRemoveFromCart(cartItem._id);
                }
              } else {
                await handleAddToCart(game);
              }
            } catch (err) {
              console.error("Erro ao atualizar carrinho:", err);
            }
          }}
        >
          {isInCart ? "Remover do Carrinho" : "Adicionar ao Carrinho"}
        </button>
      )}
    </div>
  );
};

export default GameCard;
