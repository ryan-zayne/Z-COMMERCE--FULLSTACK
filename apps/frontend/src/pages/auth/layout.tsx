import { preload } from "react-dom";
import { Outlet, useLocation } from "react-router";
import { Logo } from "@/components/primitives/Logo";
import { cnJoin } from "@/lib/utils/cn";
import { useGlobalStore } from "@/store/zustand/globalStore";

const desktopImage =
	"https://res.cloudinary.com/djvestif4/image/upload/v1700101265/z-commerce/glitter.webp";
const mobileImage =
	"https://res.cloudinary.com/djvestif4/image/upload/v1700101265/z-commerce/yellow-cart-bg.webp";

function AuthLayout() {
	const isDesktop = useGlobalStore((state) => state.isDesktop);

	const pathname = useLocation().pathname;

	const isLoginOrSignUpPath = pathname.endsWith("signin") || pathname.endsWith("signup");

	if (isDesktop) {
		preload(desktopImage, { as: "image" });
		preload(mobileImage, { as: "image" });
	}

	if (!isDesktop) {
		preload(mobileImage, { as: "image" });
		preload(desktopImage, { as: "image" });
	}

	return (
		<div
			className={cnJoin(
				`relative flex min-h-svh items-center justify-center overflow-x-hidden bg-yellow-cart bg-cover
				bg-no-repeat px-[20px] md:py-[30px] lg:bg-glitter-image lg:px-[100px]`,
				isLoginOrSignUpPath && "lg:justify-between"
			)}
		>
			<span id="Background Overlay" className="absolute inset-0 z-1 bg-[hsl(0,0%,0%,0.45)]" />

			{isDesktop && isLoginOrSignUpPath && (
				<Logo
					className={`relative bottom-[10px] z-10 ml-[-8px] w-[200px] brightness-[0.8] contrast-[1.7]
					lg:left-[40px]`}
				/>
			)}

			<Outlet />
		</div>
	);
}

export default AuthLayout;
