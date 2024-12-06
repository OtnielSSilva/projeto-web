import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { IGame } from "./types/game";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import GameDetails from "./pages/GameDetails";
import Cart from "./pages/Cart";
import axios from "axios";
import Library from "./pages/Library";

interface CartItem {
  _id: string;
  game: IGame;
}

function App() {
  const [favs, setFavs] = useState<IGame[]>([]); 
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 
  const [libraryGames, setLibraryGames] = useState<IGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibraryGames = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não está autenticado.");
      const response = await axios.get("http://localhost:3000/api/library", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        const data = response.data as { library: { games: IGame[] } };
        setLibraryGames(data.library.games || []); 
        console.log("Jogos da biblioteca:", data.library.games);
      } else {
        console.error("Erro ao buscar jogos da biblioteca.");
      }
    } catch (error) {
      console.error("Erro ao buscar jogos da biblioteca:", error);
    }
  };
  
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não está autenticado.");
      const response = await axios.get("http://localhost:3000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        const data = response.data as { wishlist: IGame[] };
        console.log(data)
        setFavs(data as unknown as IGame[]); 
      } else {
        console.error("Erro ao buscar lista de desejos.");
      }
    } catch (error) {
      console.error("Erro ao buscar lista de desejos:", error);
    }
  };
  
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não está autenticado.");
      const response = await axios.get("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        const data = response.data as { cartItems: CartItem[] };
        setCartItems(data.cartItems || []); 
      } else {
        console.error("Erro ao buscar itens do carrinho.");
      }
    } catch (error) {
      console.error("Erro ao buscar itens do carrinho:", error);
    }
  };  

  // Add or remove a game from the wishlist
  const handleFav = async (game: IGame) => {
    if (!Array.isArray(favs) || !Array.isArray(libraryGames)) {
      console.error("Estados favs ou libraryGames não estão inicializados.");
      return;
    }
  
    // Verificar se o jogo já está na biblioteca
    if (libraryGames.some((libGame) => libGame._id === game._id)) {
      alert("Este jogo já está na biblioteca.");
      return;
    }
  
    // Verificar se o jogo já está nos favoritos
    const isFavorite = favs.some((fav) => fav._id === game._id);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Usuário não está autenticado.");
        return;
      }
  
      if (isFavorite) {
        await axios.delete(`http://localhost:3000/api/wishlist/${game.appid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setFavs((prevFavs) => prevFavs.filter((fav) => fav.appid !== game.appid));
      } else {
        const response = await axios.post(
          `http://localhost:3000/api/wishlist/${game.appid}`,
          {}, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.status === 200) {
          setFavs((prevFavs) => [...prevFavs, game]);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar lista de desejos:", error);
      alert("Não foi possível atualizar a lista de desejos. Tente novamente.");
    }
  };
  
  const handleAddToCart = async (game: IGame) => {
    if (libraryGames.some((libGame) => libGame._id === game._id)) {
      alert("Este jogo já está na biblioteca.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not logged in.");
      const response = await axios.post(
        "http://localhost:3000/api/cart",
        { gameId: game._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        fetchCartItems(); 
      } else {
        throw new Error("Failed to add game to cart.");
      }
    } catch (error) {
      console.error("Error adding game to cart:", error);
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not logged in.");
      await axios.delete(`http://localhost:3000/api/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== cartItemId)
      );
    } catch (error) {
      console.error("Error removing game from cart:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchWishlist(), fetchLibraryGames(), fetchCartItems()]);
      } catch (error) {
        console.error("Erro ao carregar os dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !Array.isArray(favs) || !Array.isArray(libraryGames)) {
    return <div>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header cartItemsCount={cartItems.length} />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  handleFav={handleFav}
                  favs={favs}
                  handleAddToCart={handleAddToCart}
                  cartItems={cartItems}
                  libraryGames={libraryGames}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <Favorites
                  handleFav={handleFav}
                  favs={favs}
                  handleAddToCart={handleAddToCart}
                  cartItems={cartItems}
                  libraryGames={libraryGames}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/game/:appid" element={<GameDetails />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  fetchCartItems={fetchCartItems}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              }
            />
            <Route path="/library" element={<Library />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
