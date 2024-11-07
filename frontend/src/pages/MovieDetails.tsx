import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../types/movie";

const MovieDetails = () => {
	const { imdbID } = useParams<{ imdbID: string }>();
	const [movie, setMovie] = useState<Movie | null>(null);

	useEffect(() => {
		if (imdbID) {
			fetch(
				`https://www.omdbapi.com/?i=${imdbID}&apikey=22edc4ac`
			)
				.then((res) => res.json())
				.then((data) => {
					setMovie(data);
				});
		}
	}, [imdbID]);

	if (!movie) {
		return <div className="text-white text-center">Loading...</div>;
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
			<div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full max-w-2xl">
				<img
					src={movie.Poster}
					alt={`${movie.Title} poster`}
					className="mb-4 mx-auto"
				/>
				<div className="p-6">
					<h2 className="text-white text-3xl font-bold mb-4">{movie.Title}</h2>
					<p className="text-gray-400 text-lg mb-4">{movie.Plot}</p>
					<p className="text-gray-300 text-md mb-2">Gênero: {movie.Genre}</p>
					<p className="text-gray-300 text-md mb-2">Duração: {movie.Runtime}</p>
					<p className="text-gray-300 text-md mb-2">
						Lançamento: {movie.Released}
					</p>
					<p className="text-gray-300 text-md mb-2">
						Direção: {movie.Director}
					</p>
					<p className="text-gray-300 text-md mb-2">Elenco: {movie.Actors}</p>
					<p className="text-yellow-400 text-md">
						Classificação no IMDB: {movie.imdbRating}
					</p>
				</div>
			</div>
		</div>
	);
};

export default MovieDetails;
