import { Outlet, useLocation } from "react-router";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";

function HomeLayout() {
	const href = useLocation().pathname;

	const withoutFooter = href.startsWith("/products") || href.startsWith("/user");

	return (
		<>
			<ScrollToTopButton />
			<Navbar />
			<Outlet />
			{!withoutFooter && <Footer />}
		</>
	);
}

export default HomeLayout;
