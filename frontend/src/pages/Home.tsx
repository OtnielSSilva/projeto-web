import { useEffect, useState } from "react";
import { IGame } from "@/types/game";
import { MyCarousel } from "@/components/MyCarousel";
import MainContainer from "@/components/MainContainer";

interface HomeProps {
  handleAddToCart?: (game: IGame) => Promise<void>; 
  handleFav?: (game: IGame) => Promise<void>; 
  favs?: IGame[]; 
  cartItems?: { _id: string; game: IGame }[]; 
  handleRemoveFromCart?: (cartItemId: string) => Promise<void>; 
  libraryGames?: IGame[]; 
}

export default function Home({
  handleFav = async () => {}, 
  favs = [], 
  handleAddToCart = async () => {}, 
  cartItems = [], 
  handleRemoveFromCart = async () => {}, 
  libraryGames = [], 
}: HomeProps) {
  const [games, setGames] = useState<IGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGames = async () => {
    setIsLoading(true);
    setError(""); 
    try {
      const response = await fetch("http://localhost:3000/api/games");
      if (!response.ok) {
        throw new Error("Erro ao carregar os jogos.");
      }
      const data = await response.json();
      setGames(data.results || data || []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os jogos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <main className="flex-grow">
      <MyCarousel />
      <div className="p-4">
        {isLoading ? (
          <div className="text-center text-gray-400">Carregando...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <MainContainer
            games={games}
            handleFav={handleFav}
            favs={favs}
            handleAddToCart={handleAddToCart}
            cartItems={cartItems}
            handleRemoveFromCart={handleRemoveFromCart}
            libraryGames={libraryGames}
          />
        )}
      </div>
    </main>
  );
}
