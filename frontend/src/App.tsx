import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import { IGame } from "./types/game";
import Header from "./components/Header"; 
import Footer from "./components/Footer"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  const [favs, setFavs] = useState<IGame[]>([]);

  // Recupera favoritos do localStorage ao carregar o componente
  useEffect(() => {
    const storedFavs = localStorage.getItem("favs");
    if (storedFavs) {
      setFavs(JSON.parse(storedFavs));
    }
  }, []);

  // Adiciona ou remove um jogo dos favoritos
  const handleFav = (game: IGame) => {
    const isFavorite = favs.some((fav) => fav.appid === game.appid);

    let updatedFavs;
    if (isFavorite) {
      updatedFavs = favs.filter((fav) => fav.appid !== game.appid);
    } else {
      updatedFavs = [...favs, game];
    }
    setFavs(updatedFavs);
    localStorage.setItem("favs", JSON.stringify(updatedFavs));
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={<Home handleFav={handleFav} favs={favs} />}
            />
            <Route
              path="/favorites"
              element={<Favorites handleFav={handleFav} favs={favs} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
