import { Link, useLocation } from "react-router";
import BellSvg from "@/assets/BellSvg";

const notFoundMessageDefaults = {
	"/checkout": "Checkout page still under construction",
	"/contact-us": "Contact page still under construction",
	"/wishlist": "WishList page still under construction",
};

const getDefaultMessage = (href: string) => {
	if (!(href in notFoundMessageDefaults)) return;

	return notFoundMessageDefaults[href as keyof typeof notFoundMessageDefaults];
};

function NotFoundPage() {
	const href = useLocation().pathname;

	return (
		<section className="fixed inset-0 flex flex-col items-center justify-center text-center">
			<BellSvg />

			<h1 className="mt-8">{getDefaultMessage(href) ?? "Page Not Found"}</h1>

			<Link
				className="nav-link-transition relative mt-6 inline-flex items-center border-b border-dotted
					border-dark font-medium text-heading hover:border-black/0"
				to="/"
			>
				Back to Home
			</Link>
		</section>
	);
}

export default NotFoundPage;
