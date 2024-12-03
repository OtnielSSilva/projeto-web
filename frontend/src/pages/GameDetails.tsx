import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IGame } from "../types/game";
import { IComment } from '../types/comment';

const GameDetails = () => {
  const { appid } = useParams<{ appid: string }>();
  const numericAppId = parseInt(appid || "", 10); // Converter appid para número
  const [game, setGame] = useState<IGame | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Funções auxiliares
  const getToken = () => localStorage.getItem("token");

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const isUserCommentOwner = (commentUserId: string) => {
    const token = getToken();
    if (!token) return false;

    const decodedToken = parseJwt(token);
    return decodedToken && decodedToken.id === commentUserId;
  };

  // Carregar detalhes do jogo
  useEffect(() => {
    const fetchGameDetails = async () => {
      if (isNaN(numericAppId)) {
        setError("ID do jogo inválido.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/games/${numericAppId}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar os detalhes do jogo.");
        }
        const data = await response.json();
        setGame(data);
        setError("");
      } catch (err) {
        setError("Não foi possível carregar os detalhes do jogo.");
      } finally {
        setIsLoading(false);
      }
    };

    if (numericAppId) {
      fetchGameDetails();
    }
  }, [numericAppId]);

  // Carregar comentários
  useEffect(() => {
    const fetchComments = async () => {
      if (isNaN(numericAppId)) {
        setError("ID do jogo inválido.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/games/${numericAppId}/comments`);
        if (!response.ok) {
          throw new Error("Erro ao carregar os comentários.");
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os comentários.");
      }
    };

    if (numericAppId) {
      fetchComments();
    }
  }, [numericAppId]);

  // Adicionar comentário
  const handleAddComment = async () => {
    const token = getToken();
    if (!token) {
      alert("Você precisa estar logado para adicionar um comentário.");
      navigate("/login");
      return;
    }

    if (isNaN(numericAppId)) {
      alert("ID do jogo inválido.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/games/${numericAppId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Erro ao adicionar comentário.");
        return;
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar comentário.");
    }
  };

  // Editar comentário
  const startEditingComment = (comment: IComment) => {
    setEditingCommentId(comment._id);
    setEditComment(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditComment("");
  };

  const handleUpdateComment = async () => {
    const token = getToken();
    if (!token) {
      alert("Você precisa estar logado para editar um comentário.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/comments/${editingCommentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editComment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Erro ao atualizar comentário.");
        return;
      }

      const updatedComment = await response.json();
      setComments(
        comments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
      cancelEditing();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar comentário.");
    }
  };

  // Excluir comentário
  const handleDeleteComment = async (commentId: string) => {
    const token = getToken();
    if (!token) {
      alert("Você precisa estar logado para excluir um comentário.");
      navigate("/login");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir este comentário?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Erro ao excluir comentário.");
        return;
      }

      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir comentário.");
    }
  };

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
          <h2 className="mb-4 text-3xl font-bold text-white">
            {game.name || "Nome não disponível"}
          </h2>
          <div className="mb-4 text-lg text-gray-400">
            <div dangerouslySetInnerHTML={{ __html: game.detailed_description }} />
          </div>
          {/* ... Outros detalhes do jogo ... */}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Voltar
          </button>

          {/* Seção de comentários */}
          <div className="mt-6">
            <h3 className="mb-4 text-2xl font-bold text-white">Comentários</h3>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="p-4 mb-4 bg-gray-700 rounded">
                  <div className="flex items-center mb-2">
                    <img
                      src={comment.user.photoUrl || "https://via.placeholder.com/40"}
                      alt={`${comment.user.name}'s avatar`}
                      className="w-10 h-10 mr-2 rounded-full"
                    />
                    <span className="text-lg font-semibold text-white">
                      {comment.user.name}
                    </span>
                  </div>
                  <p className="text-gray-200">{comment.content}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  {isUserCommentOwner(comment.user._id) && (
                    <div className="flex mt-2 space-x-2">
                      <button
                        onClick={() => startEditingComment(comment)}
                        className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            )}
          </div>

          {/* Formulário para adicionar novo comentário */}
          {editingCommentId ? (
            <div className="mt-6">
              <h3 className="mb-4 text-2xl font-bold text-white">Editar Comentário</h3>
              <textarea
                className="w-full p-2 mb-2 text-gray-200 bg-gray-700 rounded"
                rows={4}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
              ></textarea>
              <button
                onClick={handleUpdateComment}
                className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600"
              >
                Salvar
              </button>
              <button
                onClick={cancelEditing}
                className="px-4 py-2 ml-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          ) : (
            getToken() && (
              <div className="mt-6">
                <h3 className="mb-4 text-2xl font-bold text-white">Adicionar Comentário</h3>
                <textarea
                  className="w-full p-2 mb-2 text-gray-200 bg-gray-700 rounded"
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Enviar
                </button>
              </div>
            )
          )}

          {!getToken() && (
            <p className="mt-4 text-gray-400">
              Você precisa estar{" "}
              <a href="/login" className="text-blue-500">
                logado
              </a>{" "}
              para adicionar um comentário.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
