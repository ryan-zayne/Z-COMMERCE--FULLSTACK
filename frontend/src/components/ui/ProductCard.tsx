import { useToggle } from "@zayne-labs/toolkit-react";
import { m } from "motion/react";
import { Link } from "react-router";
import { Card } from "@/components/primitives/card";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import type { ProductItemSchemaType } from "@/store/react-query/types";
import { useGlobalStore } from "@/store/zustand/globalStore";
import { useShopStore } from "@/store/zustand/shopStore";
import type { ResponseDataItemInCart } from "@/store/zustand/types";
import { Button } from "../primitives/button";
import { IconBox } from "../primitives/IconBox";
import { ImageComponent } from "../primitives/ImageComponent";
import { StarRating } from "../primitives/StarRating";

type ProductCardProps = {
	image: string;
	link: string;
	productItem: ProductItemSchemaType | ResponseDataItemInCart;
};

function ProductCard(props: ProductCardProps) {
	const { image, link, productItem } = props;

	const isMobile = useGlobalStore((state) => state.isMobile);

	const { addToCart, toggleAddToWishList } = useShopStore((state) => state.actions);

	const isProductInWishList = useShopStore((state) => state.wishList).some(
		(item) => item.id === productItem.id
	);

	const [isHearted, toggleHearted] = useToggle(isProductInWishList);

	const handleAddToCart: React.MouseEventHandler = (event) => {
		event.preventDefault();

		addToCart(productItem);
	};

	const handleAddToWishList: React.MouseEventHandler = (event) => {
		event.preventDefault();

		toggleHearted();
		toggleAddToWishList(productItem);
	};

	return (
		<m.li
			className="w-[min(100%,260px)]"
			initial={{ opacity: 0, y: 200 }}
			whileInView={{
				opacity: 1,
				transition: { duration: 0.8, type: "tween" },
				y: 0,
			}}
			viewport={{ once: true }}
		>
			<Card.Root
				className={cnMerge(
					`group/card size-full rounded-[12px] transition-[scale,box-shadow,background-color]
					duration-1000 ease-in-out hover:scale-[1.03] hover:shadow-[0_0_6px_0_hsl(60,100%,0%,1)]
					dark:hover:bg-primary dark:hover:shadow-[0_0_6px_0px_var(--carousel-dot)]`,
					isHearted
						&& `scale-[1.03] shadow-[0_0_6px_0_hsl(60,_100%,_0%,_1)] dark:scale-[1.03]
						dark:shadow-[0_0_6px_0px_var(--carousel-dot)]`
				)}
			>
				<Link to={link} className="flex size-full flex-col justify-between">
					<Card.Header
						as="div"
						className="relative h-[180px] w-full overflow-hidden rounded-[8px_8px_0_0]"
					>
						<Button
							unstyled={true}
							type="button"
							onClick={handleAddToWishList}
							className={cnJoin(
								`group/btn absolute right-[13px] bottom-[110px] z-100 rounded-[50%] bg-primary
								p-[7px]`,

								isHearted ?
									"translate-y-0 opacity-100"
								:	`translate-y-[50px] opacity-0 transition-[opacity,translate] duration-1000
									group-hover/card:translate-y-0 group-hover/card:opacity-100`
							)}
						>
							{isHearted ?
								<IconBox
									icon="ant-design:heart-filled"
									className="scale-[1.16] text-[16px] text-heading group-active/btn:scale-[1.23]"
								/>
							:	<IconBox
									icon="ant-design:heart-outlined"
									className="text-[16px] text-carousel-dot group-hover/btn:text-heading
										group-active/btn:scale-[1.23]"
								/>
							}
						</Button>

						<ImageComponent
							className={cnJoin(
								`rounded-[8px_8px_0_0] brightness-[0.9] transition-transform duration-800
								ease-in-out group-hover/card:scale-[1.17]`,
								isHearted && "scale-[1.17]"
							)}
							src={image}
							loading="lazy"
							imageType="hasSkeleton"
							onClick={(e) => isMobile && e.preventDefault()}
						/>
					</Card.Header>

					<Card.Content className="px-[14px] pt-[10px]">
						<header
							className="flex min-h-[72px] items-center justify-between gap-[10px] font-semibold"
						>
							<h3 className="capitalize">{productItem.title}</h3>
							<span className="text-[18px]">
								<sup className="text-[14px]">$</sup>+ {productItem.price}
								<sup className="text-[14px]">.00</sup>
							</span>
						</header>

						<p className="mt-[5px] min-h-[60px] max-w-[30ch] text-[12px]">
							{productItem.description}
						</p>
					</Card.Content>

					<Card.Footer className="p-[13px_10px_10px]">
						<StarRating rating={productItem.rating} />

						<hr
							className={cnJoin(
								"h-[1.8px] bg-carousel-dot group-hover/card:opacity-100",
								isHearted ? "opacity-0" : "opacity-100"
							)}
						/>

						<Button
							variant="cart"
							theme="secondary"
							className="mt-[10px] p-[8px_13px] text-[13px] font-medium active:translate-y-[1.5px]"
							onClick={handleAddToCart}
						>
							Add to Cart
						</Button>
					</Card.Footer>
				</Link>
			</Card.Root>
		</m.li>
	);
}

export { ProductCard };
