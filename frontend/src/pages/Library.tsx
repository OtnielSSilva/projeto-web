import { useEffect, useState } from "react";
import { IGame } from "../types/game"; // Adjust the path to where IGame is defined

const API_BASE_URL = "http://localhost:3000/api/library";

const Library = () => {
  const [games, setGames] = useState<IGame[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchLibrary = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao carregar a biblioteca.");
      }

      const data = await response.json();
      setGames(data.library.games); 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGame = async (gameId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${gameId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao remover o jogo.");
      }

      setGames((prevGames) => prevGames.filter((game) => game._id !== gameId)); 
      alert("Jogo removido da biblioteca!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  if (loading) {
    return <p>Carregando biblioteca...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Minha Biblioteca</h1>
      {games.length === 0 ? (
        <p>Sua biblioteca está vazia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <div
              key={game._id}
              className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={game.header_image || "/images/placeholder.jpg"}
                alt={game.name}
                className="w-32 h-32 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-bold text-white text-center mb-2">
                {game.name}
              </h2>
              <p className="text-gray-400 text-sm text-center mb-2">
                {game.release_date?.date || "Data de lançamento indisponível"}
              </p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleRemoveGame(game._id)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
