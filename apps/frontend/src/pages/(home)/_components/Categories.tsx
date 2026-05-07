import { tw } from "@zayne-labs/toolkit-core";
import { m } from "motion/react";
import { Link } from "react-router";
import { ForWithWrapper } from "@/components/primitives/for";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";
import { useThemeStore } from "@/store/zustand/themeStore";

const categories = [
	{
		bgDark: tw`bg-[hsl(27,96%,33%)]`,
		bgLight: tw`bg-orange-400`,
		image: "https://res.cloudinary.com/djvestif4/image/upload/v1685436586/z-commerce/smartphone-transformed_jbfngh_t4v6hj.webp",
		imageAspectRatio: "aspect-[0.83]",
		path: "products/smartphones",
		title: "SmartPhones",
	},
	{
		bgDark: tw`bg-[hsl(200,6%,31%)]`,
		bgLight: tw`bg-gray-400`,
		image: "https://res.cloudinary.com/djvestif4/image/upload/v1685436585/z-commerce/laptop-transformed_dhamlu_dmts1f.webp",
		imageAspectRatio: "aspect-[1.33]",
		path: "products/laptops",
		title: "Laptops",
	},
	{
		bgDark: tw`bg-[hsl(270,95%,25%)]`,
		bgLight: tw`bg-purple-400`,
		image: "https://res.cloudinary.com/djvestif4/image/upload/v1685436585/z-commerce/car-transformed_wegeou.webp",
		imageAspectRatio: "aspect-[2.02]",
		path: "products/vehicles",
		title: "Vehicles",
	},
	{
		bgDark: tw`bg-[hsl(188,86%,38%)]`,
		bgLight: tw`bg-cyan-400`,
		image: "https://res.cloudinary.com/djvestif4/image/upload/v1685436588/z-commerce/watches-transformed_tgsflz.webp",
		imageAspectRatio: "aspect-[1.21]",
		path: "products/watches",
		title: "Watches",
	},
	{
		bgDark: tw`bg-[hsl(151,76%,26%)]`,
		bgLight: tw`bg-green-300`,
		image: "https://res.cloudinary.com/djvestif4/image/upload/v1685436587/z-commerce/lighting-transformed_bzmi3h.webp",
		imageAspectRatio: "aspect-[1.03]",
		path: "products/lighting",
		title: "Digital Lighting",
	},
];

function Categories() {
	const isDarkMode = useThemeStore((state) => state.isDarkMode);

	return (
		<section id="Categories" className="mt-[60px] flex flex-col px-10 lg:items-center">
			<h2 className="text-center text-[25px] font-semibold lg:text-[40px]">All Categories</h2>

			<ForWithWrapper
				className="mt-7.5 grid auto-rows-[200px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))]
					justify-items-center gap-7.5 lg:auto-rows-[230px] lg:grid-cols-[repeat(3,minmax(300px,1fr))]
					lg:gap-10"
				each={categories}
				renderItem={(category) => (
					<m.li
						key={category.title}
						initial={{ opacity: 0, y: 70 }}
						whileInView={{
							opacity: 1,
							transition: { duration: 0.7 },
							y: 0,
						}}
						viewport={{ margin: "-20px 0px 0px", once: true }}
						whileHover={{ scale: 1.09, transition: { duration: 0.3 } }}
						className={cnJoin(
							`flex w-[min(100%,270px)] justify-between gap-4 rounded-[50px] p-5 lg:w-full
							lg:rounded-[60px]`,
							[isDarkMode ? category.bgDark : category.bgLight]
						)}
					>
						<div className="flex min-w-[120px] shrink-0 flex-col justify-center gap-1 lg:gap-2.5">
							<h3 className="text-center text-[18px] lg:text-[20px]">{category.title}</h3>

							<Button
								variant={"shop"}
								className="w-full bg-body p-2 text-(--text-body) active:translate-y-[1.5px] lg:px-7
									lg:text-[20px]"
								asChild={true}
							>
								<Link to={category.path}>Shop Now</Link>
							</Button>
						</div>

						<div className="flex w-[120px] items-center lg:w-[150px]">
							<img
								className={category.imageAspectRatio}
								src={category.image}
								loading="lazy"
								alt=""
							/>
						</div>
					</m.li>
				)}
			/>
		</section>
	);
}
export default Categories;
