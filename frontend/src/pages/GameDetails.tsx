import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IGame } from "../types/game";

const GameDetails = () => {
  const { appid } = useParams<{ appid: string }>();
  const [game, setGame] = useState<IGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (appid) {
      fetch(`http://localhost:3000/api/games/${appid}`) // Adicionando o ID do jogo ao endpoint
        .then((res) => {
          if (!res.ok) {
            throw new Error("Erro ao buscar os detalhes do jogo.");
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            setGame(data);
            setError("");
          } else {
            setError("Detalhes do jogo não encontrados.");
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar detalhes do jogo:", err);
          setError("Não foi possível carregar os detalhes do jogo.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [appid]);

  if (isLoading) {
    return <div className="text-center text-white">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center text-gray-400">
        <p>Detalhes do jogo não encontrados.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-2xl overflow-hidden bg-gray-800 rounded-lg shadow-lg">
        <img
          src={game.header_image || "https://via.placeholder.com/600x300"}
          alt={`${game.name || "Jogo"} header`}
          className="mx-auto mb-4"
        />
        <div className="p-6">
          <h2 className="mb-4 text-3xl font-bold text-white">{game.name || "Nome não disponível"}</h2>
          <p className="mb-4 text-lg text-gray-400">
          <div
            dangerouslySetInnerHTML={{__html: game.detailed_description}}
          />
            {/* {game.detailed_description || "Descrição não disponível."} */}
          </p>
          <p className="mb-2 text-gray-300 text-md">
            <strong>Gêneros:</strong>{" "}
            {game.genres && game.genres.length > 0
              ? game.genres.map((genre) => genre.description).join(", ")
              : "Indisponível"}
          </p>
          <p className="mb-2 text-gray-300 text-md">
            <strong>Desenvolvedores:</strong>{" "}
            {game.developers && game.developers.length > 0
              ? game.developers.join(", ")
              : "Indisponível"}
          </p>
          <p className="mb-2 text-gray-300 text-md">
            <strong>Publicadores:</strong>{" "}
            {game.publishers && game.publishers.length > 0
              ? game.publishers.join(", ")
              : "Indisponível"}
          </p>
          <p className="mb-2 text-gray-300 text-md">
            <strong>Data de Lançamento:</strong>{" "}
            {game.release_date?.date || "Indisponível"}
          </p>
          {game.metacritic && (
            <p className="text-yellow-400 text-md">
              <strong>Metacritic Score:</strong> {game.metacritic.score}
            </p>
          )}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
