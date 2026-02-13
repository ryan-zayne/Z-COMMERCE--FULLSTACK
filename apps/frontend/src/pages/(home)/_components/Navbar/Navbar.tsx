import { NavIconsHeader } from "./NavIcons/NavIconsHeader";
import { NavigationLinks } from "./NavigationLinks/NavigationLinks";

function Navbar() {
	return (
		<header
			id="Navbar"
			className="flex flex-wrap justify-center pt-[10px] max-md:pb-[14px] md:gap-[20px]"
		>
			<NavIconsHeader />
			<NavigationLinks />
		</header>
	);
}

export { Navbar };
