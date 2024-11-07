import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

interface HeaderProps {
	handleHomeClick?: () => void;
}

function Header({ handleHomeClick }: HeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();
	const currentPath = location.pathname;

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
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default Header;
