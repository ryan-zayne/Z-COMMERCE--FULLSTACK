import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { IconBox } from "@/components/common/IconBox";
import { DropDown, useDropdown } from "@/components/ui/dropdown";
import { cnJoin } from "@/lib/utils/cn";
import { useGlobalStore } from "@/store/zustand/globalStore";

const categories = [
	{ path: "products", title: "All Products" },
	{ path: "products/smartphones", title: "Smartphones" },
	{ path: "products/laptops", title: "Laptops" },
	{ path: "products/watches", title: "Watches" },
	{ path: "products/vehicles", title: "Vehicles" },
	{ path: "products/lighting", title: "Digital Lighting" },
];

function CategoryMenu(props: { deviceType: "desktop" | "mobile" }) {
	const { deviceType } = props;

	const pathname = useLocation().pathname;

	const isNavShow = useGlobalStore((state) => state.isNavShow);
	const { toggleNavShow } = useGlobalStore((state) => state.actions);

	const dropdown = useDropdown({ initialState: deviceType === "desktop" && pathname === "/" });

	useEffect(() => {
		if (deviceType !== "desktop") return;

		const selectedAction = pathname === "/" ? dropdown.onOpen : dropdown.onClose;

		selectedAction();
	}, [dropdown.onClose, dropdown.onOpen, pathname, deviceType]);

	useEffect(() => {
		if (deviceType === "desktop") return;

		const onClose = dropdown.onClose;

		!isNavShow && onClose();
	}, [deviceType, isNavShow, dropdown.onClose]);

	const CategoryList = categories.map((category) => (
		<Link
			key={category.title}
			onClick={deviceType !== "desktop" ? toggleNavShow : undefined}
			to={category.path}
			className="flex items-center justify-between py-[10px]
				[border-bottom:1px_solid_var(--color-primary)] max-lg:hover:text-heading"
		>
			<p>{category.title}</p>

			{deviceType === "desktop" && <IconBox icon="bi:chevron-double-right" />}
		</Link>
	));

	const DEVICE_TYPE_LOOKUP = {
		desktop: () => (
			<DropDown.RootProvider
				value={dropdown}
				id={"Shop-By-Categories DropDown"}
				className={"relative z-50 ml-[10px]"}
			>
				<DropDown.Trigger
					className="flex w-[280px] cursor-pointer flex-row-reverse justify-end gap-[10px]
						rounded-[5px_5px_0_0] bg-heading p-[10px_15px] text-primary"
				>
					<h3 className="font-medium">Shop By Category</h3>

					<span className="text-[16px]">
						<IconBox icon="bi:menu-button-fill" />
					</span>
				</DropDown.Trigger>

				<DropDown.Content
					id="Category List"
					classNames={{
						base: "absolute h-[485px] w-full",
						listContainer: cnJoin(
							`bg-body px-[20px] shadow-[0_1px_3px_0_var(--color-primary)]
							dark:shadow-[0_1px_3px_0.3px_var(--color-carousel-dot)]`,
							dropdown.isOpen ? "pt-[50px]" : "shadow-none"
						),
					}}
				>
					{CategoryList}
				</DropDown.Content>
			</DropDown.RootProvider>
		),

		mobile: () => (
			<DropDown.RootProvider value={dropdown} id="Mobile-Categories dropdown">
				<DropDown.Trigger className="relative flex cursor-pointer items-center gap-[5px]">
					<h4>Categories</h4>

					<span
						className={cnJoin(
							"text-[12px] [transition:transform_350ms_ease]",
							dropdown.isOpen && "rotate-180"
						)}
					>
						<IconBox icon="basil:caret-down-outline" />
					</span>
				</DropDown.Trigger>

				<DropDown.Content
					classNames={{
						base: `absolute inset-x-0 z-50 m-[5px_20px_0] rounded-[5px] bg-[hsl(215,19%,35%,0.9)]
						[backdrop-filter:blur(40px)]`,

						listContainer: cnJoin(
							"flex flex-col gap-[15px] pl-[30px] text-[14px]",
							dropdown.isOpen && "py-[20px]"
						),
					}}
				>
					{CategoryList}
				</DropDown.Content>
			</DropDown.RootProvider>
		),
	};

	return DEVICE_TYPE_LOOKUP[deviceType]();
}

export default CategoryMenu;
