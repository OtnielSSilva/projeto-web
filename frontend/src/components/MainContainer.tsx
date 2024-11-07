import MovieCard from "./MovieCard";
import { Movie } from "../types/movie";

interface MainContainerProps {
	movies: Movie[];
	handleFav: (movie: Movie) => void;
	favs: Movie[];
}

function MainContainer({
	movies,
	handleFav,
	favs,
}: MainContainerProps): JSX.Element {
	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-wrap gap-4 justify-center">
				{movies.map((movie: Movie) => (
					<MovieCard
						key={movie.imdbID}
						movie={movie}
						handleFav={() => handleFav(movie)}
						favs={favs}
					/>
				))}
			</div>
		</div>
	);
}

export default MainContainer;
