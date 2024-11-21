import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdFavorite, MdLogin } from "react-icons/md";

interface HeaderProps {
  handleHomeClick?: () => void;
}

function Header({ handleHomeClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; photoUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Para exibir um estado de carregamento
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false); // Define carregamento como falso se não houver token
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.name && data.photoUrl) {
            setUser({ name: data.name, photoUrl: data.photoUrl });
          } else {
            localStorage.removeItem("token"); // Remove token inválido
          }
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false); // Sempre define carregamento como falso
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token ao deslogar
    setUser(null);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <span className="self-center text-xl sm:text-xl md:text-2xl lg:text-2xl font-semibold whitespace-nowrap text-white">
          <Link to="/" onClickCapture={handleHomeClick}>
            Cinephile's <span className="text-blue-500">Picks</span>
          </Link>
        </span>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-600 rounded-lg bg-gray-700 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-gray-800">
            <li>
              <Link
                to="/"
                className={`flex items-center py-2 px-3 rounded md:p-0 ${
                  currentPath === "/"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-400 hover:bg-gray-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                }`}
                aria-current={currentPath === "/" ? "page" : undefined}
                onClickCapture={handleHomeClick}
              >
                <FaHome size={24} />
                <span className="ml-2">Início</span>
              </Link>
            </li>
            <li>
              <Link
                to="/favorites"
                className={`flex items-center py-2 px-3 rounded md:p-0 ${
                  currentPath === "/favorites"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-400 hover:bg-gray-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                }`}
              >
                <MdFavorite size={24} />
                <span className="ml-2">Favoritos</span>
              </Link>
            </li>
            {isLoading ? (
              <li className="text-gray-400">Carregando...</li>
            ) : !user ? (
              <li>
                <Link
                  to="/login"
                  className={`flex items-center py-2 px-3 rounded md:p-0 ${
                    currentPath === "/login"
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                      : "text-gray-400 hover:bg-gray-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
                  }`}
                >
                  <MdLogin size={24} />
                  <span className="ml-2">Login</span>
                </Link>
              </li>
            ) : (
              <li className="flex items-center gap-3">
                <img
                  src={user.photoUrl}
                  alt="Foto do usuário"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-white">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline"
                >
                  Sair
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
