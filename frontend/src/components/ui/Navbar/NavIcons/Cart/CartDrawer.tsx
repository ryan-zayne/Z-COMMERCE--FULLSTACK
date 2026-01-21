import { getElementList } from "@zayne-labs/ui-react/common/for";
import { Show } from "@zayne-labs/ui-react/common/show";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/primitives/button";
import { IconBox } from "@/components/primitives/IconBox";
import { Drawer, type DrawerContentProps } from "@/components/ui/Drawer";
import { useDrawer } from "@/components/ui/Drawer/drawer-context";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import { useShopStore } from "@/store/zustand/shopStore";
import { useThemeStore } from "@/store/zustand/themeStore";
import { CartItem } from "./CartItem";

type CartDrawerProps = { placement?: DrawerContentProps["placement"] };

function CartDrawer(props: CartDrawerProps) {
	const { placement = "right" } = props;

	const cart = useShopStore((state) => state.cart);
	const totalPrice = useShopStore((state) => state.totalPrice);

	const isDarkMode = useThemeStore((state) => state.isDarkMode);

	const drawer = useDrawer();

	const [CartItemsList] = getElementList();

	return (
		<>
			<Button
				unstyled={true}
				type="button"
				className="relative active:scale-[1.1]"
				onClick={drawer.onToggle}
			>
				<IconBox icon="bx:cart-alt" className="hover:text-heading lg:text-[23px]" />

				{cart.length > 0 && (
					<span
						className="absolute top-[-6px] right-[-10px] inline-flex size-[17px] items-center
							justify-center rounded-[50%] bg-secondary text-[12px] font-medium"
					>
						{cart.length}
					</span>
				)}
			</Button>

			<Drawer.RootProvider value={drawer}>
				<Drawer.Overlay />

				<Drawer.Content
					placement={placement}
					className="w-[min(100%,320px)] pb-[16px] lg:min-w-[400px]"
				>
					<header
						className="mx-3 flex items-center justify-between gap-[20px] border-b border-b-dark p-4
							pt-[70px]"
					>
						<IconBox
							icon="mdi:cart"
							className={cnJoin("text-[45px]", isDarkMode ? "text-carousel-dot" : "text-primary")}
						/>

						<Drawer.CloseButton
							className="rounded-[4px] bg-heading p-[2px] text-[26px] text-primary lg:scale-[1.2]"
						/>
					</header>

					<section className="px-[13px] pt-[40px] lg:px-[20px]">
						<Show.Root when={cart.length > 0}>
							<CartItemsList
								className="flex min-h-[140px] flex-col gap-[10px]"
								each={cart}
								renderItem={(item) => <CartItem key={item.title} product={item} />}
							/>

							<Show.Fallback>
								<div className="text-center italic">
									<h4 className="text-[28px] font-medium">Why this place go dey empty?</h4>
									<p className="mt-3 text-[16px]">
										Shey na window shopping you come dey do or abi wetin?😐
									</p>
								</div>
							</Show.Fallback>
						</Show.Root>
					</section>

					<footer className="mt-12 flex flex-col gap-[10px]">
						<p className="mt-[10px] flex justify-between px-[10px] text-[18px] font-semibold">
							Total:
							<span className="text-[20px]">
								<sup>$</sup>
								{totalPrice}
								<sup>.00</sup>
							</span>
						</p>

						<Show.Root when={cart.length > 0}>
							<Drawer.Trigger
								className={cnMerge(
									buttonVariants({ theme: "secondary" }),
									`mx-[13px] text-[14px] font-semibold [transition:box-shadow_300ms_ease]
									hover:shadow-[0_4px_20px_rgb(51,62,72,0.4)] lg:mx-[20px]`
								)}
								asChild={true}
							>
								<Link to="/checkout">Checkout</Link>
							</Drawer.Trigger>
						</Show.Root>
					</footer>
				</Drawer.Content>
			</Drawer.RootProvider>
		</>
	);
}

export { CartDrawer };
