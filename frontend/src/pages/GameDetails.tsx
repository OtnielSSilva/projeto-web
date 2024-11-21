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
    return <div className="text-white text-center">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-gray-400 text-center">
        <p>Detalhes do jogo não encontrados.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full max-w-2xl">
        <img
          src={game.header_image || "https://via.placeholder.com/600x300"}
          alt={`${game.name || "Jogo"} header`}
          className="mb-4 mx-auto"
        />
        <div className="p-6">
          <h2 className="text-white text-3xl font-bold mb-4">{game.name || "Nome não disponível"}</h2>
          <p className="text-gray-400 text-lg mb-4">
            {game.detailed_description || "Descrição não disponível."}
          </p>
          <p className="text-gray-300 text-md mb-2">
            <strong>Gêneros:</strong>{" "}
            {game.genres && game.genres.length > 0
              ? game.genres.map((genre) => genre.description).join(", ")
              : "Indisponível"}
          </p>
          <p className="text-gray-300 text-md mb-2">
            <strong>Desenvolvedores:</strong>{" "}
            {game.developers && game.developers.length > 0
              ? game.developers.join(", ")
              : "Indisponível"}
          </p>
          <p className="text-gray-300 text-md mb-2">
            <strong>Publicadores:</strong>{" "}
            {game.publishers && game.publishers.length > 0
              ? game.publishers.join(", ")
              : "Indisponível"}
          </p>
          <p className="text-gray-300 text-md mb-2">
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
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
