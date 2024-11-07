function Footer() {
	return (
		<footer className="bg-gray-800 text-white p-4 text-center">
			<p className="text-sm">
				&copy; {new Date().getFullYear()} Cinephile's Picks. All rights
				reserved.
			</p>
		</footer>
	);
}

export default Footer;
