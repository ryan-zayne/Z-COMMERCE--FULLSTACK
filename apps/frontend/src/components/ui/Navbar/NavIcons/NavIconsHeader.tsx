import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToggle } from "@zayne-labs/toolkit-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/components/primitives/button";
import { IconBox } from "@/components/primitives/IconBox";
import { Logo } from "@/components/primitives/Logo";
import { DropDown } from "@/components/ui/DropDown";
import { SearchForm } from "@/components/ui/SearchForm";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import { sessionQuery } from "@/store/react-query/queryOptions";
import { useGlobalStore } from "@/store/zustand/globalStore";
import { useShopStore } from "@/store/zustand/shopStore";
import { useThemeStore } from "@/store/zustand/themeStore";
import { CartDrawer } from "./Cart/CartDrawer";
import { HamBurgerButton } from "./HamBurgerButton";
import { ThemeSwitchButton } from "./ThemeSwitchButton";

function NavIconsHeader() {
	const isDarkMode = useThemeStore((state) => state.isDarkMode);
	const isMobile = useGlobalStore((state) => state.isMobile);
	const isDesktop = useGlobalStore((state) => state.isDesktop);
	const [isSearchShow, toggleSearchShow] = useToggle(false);

	const cart = useShopStore((state) => state.cart);

	const sessionQueryResult = useQuery(sessionQuery());

	useEffect(() => {
		if (!isMobile && isSearchShow) {
			toggleSearchShow(false);
		}
		// eslint-disable-next-line react-hooks/rule-suppression
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobile, isSearchShow]);

	const queryClient = useQueryClient();

	const logout = () => {
		void callBackendApi("@get/auth/signout", {
			meta: {
				toast: { success: true },
			},
			onSuccess: () => {
				queryClient.removeQueries({ queryKey: sessionQuery().queryKey });
			},
		});
	};

	return (
		<div
			id="Nav Icons and Logo"
			className="relative flex w-full items-center justify-between gap-[10px] px-[10px] select-none
				lg:pr-[40px]"
		>
			<Logo className={cnJoin(isDarkMode && "brightness-[0.8] contrast-[1.8]")} />

			<SearchForm
				isSearchShow={isSearchShow}
				classNames={{
					base: cnMerge(
						isMobile
							&& `absolute inset-x-0 top-[6.10px] flex h-0 justify-center overflow-y-hidden
							rounded-[0_0_5px_5px] bg-body px-[20px] transition-[height] duration-400 ease-out`,
						isSearchShow && "h-[8.10px] duration-600 ease-[ease]"
					),
					container: cnJoin(!isMobile && "w-[min(100%,54vw)]"),
				}}
			/>

			<div
				id="NavIcons"
				className="flex w-[clamp(190px,42vw,220px)] items-center justify-between text-[20px]"
			>
				{isMobile && (
					<Button
						unstyled={true}
						className="hover:text-heading active:scale-[1.25]"
						onClick={toggleSearchShow}
					>
						<IconBox icon="bx:search-alt-2" />
					</Button>
				)}

				<Button
					unstyled={true}
					className="hover:transform-[rotateY(360deg)] hover:text-heading
						hover:[transition:transform_1000ms_ease-in-out] active:scale-[1.2] lg:text-[23px]"
				>
					<Link to="/wishlist">
						<IconBox icon="bx:heart" />
					</Link>
				</Button>

				<DropDown.Root className="relative flex items-center justify-center">
					<DropDown.Trigger className="hover:text-heading lg:text-[23px]">
						<IconBox icon="bx:user" />
					</DropDown.Trigger>

					<DropDown.Context>
						{(ctx) => (
							<DropDown.Content
								classNames={{
									base: "absolute top-[51px] z-100 w-[150px]",
									listContainer: cnJoin(
										`flex flex-col items-start gap-[15px] rounded-[8px] bg-body px-[20px]
										text-[16px] lg:dark:shadow-[0_0px_7px_1px_var(--color-primary)]
										[&_>_*:hover]:nav-link-transition`,
										ctx.isOpen && "py-[15px]"
									),
								}}
							>
								{sessionQueryResult.data && <Link to="user/account">My Account</Link>}
								{sessionQueryResult.data && (
									<Button
										unstyled={true}
										onClick={() => {
											logout();
											ctx.onClose();
										}}
									>
										Logout
									</Button>
								)}
								{cart.length > 0 && <Link to="/checkout">Checkout</Link>}
								{!sessionQueryResult.data && <Link to="/auth/signin">Sign in</Link>}
							</DropDown.Content>
						)}
					</DropDown.Context>
				</DropDown.Root>

				<CartDrawer />

				<ThemeSwitchButton />

				{!isDesktop && <HamBurgerButton />}
			</div>
		</div>
	);
}

export { NavIconsHeader };
