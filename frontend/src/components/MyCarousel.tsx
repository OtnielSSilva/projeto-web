import { Carousel } from "flowbite-react";

const banners = [
	{ src: "/banners/polar.jpg", alt: "Polar Movie Banner" },
	{ src: "/banners/banner1.jpg", alt: "banner1" },
	{ src: "/banners/inception.jpg", alt: "Inception Movie Banner" },
	{ src: "/banners/banner2.jpg", alt: "banner2" },
	{ src: "/banners/banner4.avif", alt: "banner4" },
];

export function MyCarousel() {
	return (
		<div className="h-56 sm:h-64 xl:h-80 2xl:h-96 bg-slate-800">
			<Carousel pauseOnHover>
				{banners.map((banner, index) => (
					<img
						key={index}
						src={banner.src}
						alt={banner.alt}
						className="w-full h-full object-fill"
					/>
				))}
			</Carousel>
		</div>
	);
}
