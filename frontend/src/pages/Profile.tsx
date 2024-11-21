import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState<{ name: string; photoUrl: string } | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Você não está autenticado.");
        navigate("/login");
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
          setUserData(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Erro ao carregar o perfil.");
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor.");
        console.error(err);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!userData) {
    return <div className="text-white text-center mt-4">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <img
          src={userData.photoUrl}
          alt="Foto do Usuário"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold mb-4">{userData.name}</h2>
        <p className="text-gray-400 mb-4">
          Este é o seu perfil. Use a navegação acima para acessar outras páginas.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Profile;
