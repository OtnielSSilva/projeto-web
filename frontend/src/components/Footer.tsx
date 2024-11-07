const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white p-4 text-center">
			<div className="mx-auto px-4">
				<p className="text-sm">
					&copy; {new Date().getFullYear()} Cinephile's Picks. Todos os direitos
					reservados.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
