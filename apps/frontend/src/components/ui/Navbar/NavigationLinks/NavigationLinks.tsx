import type { UnionDiscriminator } from "@zayne-labs/toolkit-type-helpers";
import { getElementList } from "@zayne-labs/ui-react/common/for";
import { Show } from "@zayne-labs/ui-react/common/show";
import { NavLink } from "react-router";
import { Button } from "@/components/primitives/button";
import { IconBox } from "@/components/primitives/IconBox";
import { Logo } from "@/components/primitives/Logo";
import { Overlay } from "@/components/primitives/Overlay";
import { cnJoin } from "@/lib/utils/cn";
import { useGlobalStore } from "@/store/zustand/globalStore";
import CategoryMenu from "./CategoryMenu";

type NavItemsType = Array<
	UnionDiscriminator<
		[
			{
				childElement: React.ReactNode;
				className?: string;
				id: number;
				shouldShow: boolean;
			},
			{
				className?: string;
				path: string;
				title: string;
			},
		]
	>
>;

function NavigationLinks() {
	const isDesktop = useGlobalStore((state) => state.isDesktop);
	const isNavShow = useGlobalStore((state) => state.isNavShow);
	const { toggleNavShow } = useGlobalStore((state) => state.actions);

	const [NavLinksList] = getElementList("base");

	const navLinkInfoArray: NavItemsType = [
		{
			childElement: <Logo className={"mb-[20px] ml-[40px]"} />,
			id: 1,
			shouldShow: !isDesktop,
		},
		{ path: "/", title: "Home" },
		{
			childElement: <CategoryMenu deviceType={"mobile"} />,
			className: "max-lg:pl-[40px]",
			id: 2,
			shouldShow: !isDesktop,
		},
		{ path: "/products", title: "Products" },
		{ path: "/about", title: "About" },
		{ path: "/contact-us", title: "Contact" },
	];

	return (
		<nav className="relative flex w-full items-center justify-between font-medium lg:pr-[20px]">
			{isDesktop && <CategoryMenu deviceType={"desktop"} />}

			<Overlay isOpen={!isDesktop && isNavShow} onClose={toggleNavShow} className="z-100" />

			<ul
				id="Navigation List"
				className={cnJoin(
					`flex gap-[32px] [&_>_li_>_a]:relative [&_>_li_>_a.active]:text-brand-inverse
					[&_>_li_>_a:not(:has(img))]:nav-link-transition`,

					isDesktop && "relative gap-[10px]",

					!isDesktop && [
						`fixed inset-[0_0_0_auto] z-150 w-[min(220px,80%)] flex-col bg-navbar pt-[70px]
						text-[14px] text-nav-text [backdrop-filter:blur(20px)_saturate(5)] transition-transform
						ease-slide-out md:w-[240px] md:text-[16px]`,

						isNavShow ? "translate-x-0 duration-600" : "translate-x-full duration-250",
					]
				)}
			>
				{!isDesktop && (
					<Button
						unstyled={true}
						type="button"
						className={"absolute top-[23px] right-[10px] text-[18px] text-rose-600"}
						onClick={toggleNavShow}
					>
						<IconBox icon="ri:close-fill" />
					</Button>
				)}

				<NavLinksList
					each={navLinkInfoArray}
					renderItem={(navLinkInfo) => {
						const { childElement, className, id, path, shouldShow, title } = navLinkInfo;

						if (!path) {
							return (
								<Show.Root key={id} when={shouldShow}>
									<li className={className}>{childElement}</li>
								</Show.Root>
							);
						}

						return (
							<li
								key={title}
								className="max-lg:pl-[40px]"
								onClick={!isDesktop ? toggleNavShow : undefined}
							>
								<NavLink to={path}>{title}</NavLink>
							</li>
						);
					}}
				/>
			</ul>

			{isDesktop && (
				<p>
					Free shipping on <span>Orders $50</span>
				</p>
			)}
		</nav>
	);
}

export { NavigationLinks };
