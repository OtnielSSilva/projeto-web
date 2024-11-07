import { useState } from "react";
import MainContainer from "@/components/MainContainer";
import { Movie } from "@/types/movie";
import Search from "@/components/Search";
import { MyCarousel } from "@/components/MyCarousel";

interface HomeProps {
	handleFav: (movie: Movie) => void;
	favs: Movie[];
}

export default function Home({ handleFav, favs }: HomeProps) {
	const [movies, setMovies] = useState<Movie[]>([]);

	const fetchMovies = (query: string) => {
		fetch(
			`https://www.omdbapi.com/?s=${query}&page=1&apikey=22edc4ac`
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.Search) {
					setMovies(data.Search);
				} else {
					setMovies([]);
				}
			})
			.catch((error) => console.error("Error fetching movies:", error));
	};

	const handleSearch = (query: string) => {
		fetchMovies(query);
	};

	return (
		<main className="flex-grow">
			<MyCarousel />
			<Search onSearch={handleSearch} />
			<div className="p-4">
				{movies.length === 0 ? (
					<div className="text-center text-gray-400">
						<h2 className="text-xl mb-4 md:text-2xl">
							Explore Filmes e Séries Populares
						</h2>
						<p>
							Use a caixa de pesquisa acima para encontrar seus filmes favoritos
							ou navegue pelo conteúdo em destaque.
						</p>
					</div>
				) : (
					<MainContainer movies={movies} handleFav={handleFav} favs={favs} />
				)}
			</div>
		</main>
	);
}
