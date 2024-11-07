import { useState } from "react";
import { CiSearch } from "react-icons/ci";

interface SearchProps {
	onSearch?: (query: string) => void;
}

function Search({ onSearch }: SearchProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const handleSearchSubmit = () => {
		if (!onSearch) return;
		onSearch(searchQuery);
	};

	return (
		<div className="flex justify-center items-center px-4 mt-6">
			<div className="bg-gray-800 border border-gray-700 rounded-lg p-2 max-w-lg w-full flex items-center">
				<input
					type="text"
					placeholder="Pesquise pelos seus filmes favoritos..."
					value={searchQuery}
					onChange={handleSearchChange}
					onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
					className="bg-gray-800 text-white rounded-l py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
				/>
				<button
					onClick={handleSearchSubmit}
					className="bg-blue-600 hover:bg-blue-700 text-white rounded-r py-2 px-6"
				>
					<CiSearch size={24} />
				</button>
			</div>
		</div>
	);
}

export default Search;
