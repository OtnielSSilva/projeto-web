import { useEffect, useState } from "react";
import { IGame } from "@/types/game";
import { MyCarousel } from "@/components/MyCarousel";

interface HomeProps {
  handleFav: (game: IGame) => void;
  favs: IGame[];
}

export default function Home({ handleFav, favs }: HomeProps) {
  const [games, setGames] = useState<IGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/games");
      console.log("Resposta bruta:", response); 
      if (!response.ok) {
        throw new Error("Erro ao carregar os jogos.");
      }
      const data = await response.json();
      console.log("Dados recebidos:", data); 
      setGames(data.results || data || []);
      console.log("Estado atual de games:", data.results || data || []);
    } catch (err) {
      console.error("Erro ao carregar jogos:", err);
      setError("Não foi possível carregar os jogos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(); 
  }, []);

  console.log("Games no estado:", games); 

  return (
    <main className="flex-grow">
      <MyCarousel />
      <div className="p-4">
        {isLoading ? (
          <div className="text-center text-gray-400">Carregando...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : games.length === 0 ? (
          <div className="text-center text-gray-400">
            <h2 className="text-xl mb-4 md:text-2xl">Explore Jogos Populares</h2>
            <p>Não há jogos disponíveis no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game, index) => (
              <div
                key={game.appid || index}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-md p-4 hover:shadow-lg"
              >
                <img
                  src={game.header_image || "https://via.placeholder.com/300"}
                  alt={`${game.name} header`}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h3 className="text-white font-bold text-lg truncate">
                  {game.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {game.release_date?.date || "Data de lançamento não disponível"}
                </p>
                <p className="text-gray-500 text-sm">
                  Desenvolvedores:{" "}
                  {game.developers.length > 0
                    ? game.developers.join(", ")
                    : "Indisponível"}
                </p>
                <button
                  onClick={() => handleFav(game)}
                  className={`mt-2 py-2 px-4 rounded text-white font-bold ${
                    favs.some((fav) => fav.appid === game.appid)
                      ? "bg-red-500"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {favs.some((fav) => fav.appid === game.appid)
                    ? "Remover dos Favoritos"
                    : "Adicionar aos Favoritos"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
