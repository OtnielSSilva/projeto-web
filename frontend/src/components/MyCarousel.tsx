import { useEffect, useState } from "react";
import { Carousel } from "flowbite-react";
import { Link } from "react-router-dom";
import { IGame } from "../types/game";

export function MyCarousel() {
  const [games, setGames] = useState<IGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/games/featured");
        if (!response.ok) {
          throw new Error("Erro ao buscar jogos destacados.");
        }
        const data = await response.json();

        // Validar se os jogos possuem os campos essenciais
         const validGames = data.filter(
          (game: IGame) => game.header_image && game.name
        );

        // const validGames = data.filter(
        //   (game: IGame) => game.appid && game.header_image && game.name
        // );

        if (validGames.length === 0) {
          throw new Error("Nenhum jogo válido disponível para o carrossel.");
        }

        setGames(validGames);
      } catch (err) {
        console.error("Erro ao buscar jogos:", err);
        setError(
          err instanceof Error ? err.message : "Erro inesperado ao carregar os jogos."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  if (isLoading) {
    return (
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 flex items-center justify-center bg-slate-800 text-white">
        Carregando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 flex items-center justify-center bg-slate-800 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-800">
      <Carousel pauseOnHover>
        {games.map((game) => (
          <div key={game.appid || game.name} className="relative">
            <Link to={`/game/${game.appid}`}>
              <img
                src={game.header_image || "/images/placeholder.jpg"}
                alt={game.name}
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white text-center">
                {game.name}
              </div>
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
