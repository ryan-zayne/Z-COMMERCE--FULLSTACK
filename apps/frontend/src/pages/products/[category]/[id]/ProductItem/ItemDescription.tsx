import { Link } from "react-router";
import { Button } from "@/components/primitives/button";
import { IconBox } from "@/components/primitives/IconBox";
import { StarRating } from "@/components/primitives/StarRating";
import type { ProductItemSchemaType } from "@/store/react-query/types";
import { useShopStore } from "@/store/zustand/shopStore";

type ItemDescriptionProps = {
	productItem: ProductItemSchemaType;
};

function ItemDescription({ productItem }: ItemDescriptionProps) {
	const productItemInCart = useShopStore((state) => state.cart).find(
		(item) => item.id === productItem.id
	);
	const { addToCart, decrementProductQuantity } = useShopStore((state) => state.actions);

	const productQuantityChosen = productItemInCart?.quantity ?? 0;
	const quantityLeftInStock = productItem.stock - productQuantityChosen;

	const handlePlus = () => addToCart(productItem);

	const handleMinus = () => decrementProductQuantity(productItem.id);

	return (
		<article
			className="mt-[25px] flex max-w-[460px] flex-col max-md:mx-auto md:mt-0 lg:gap-[20px] lg:pb-[5px]"
		>
			<div className="flex items-center justify-between lg:w-[90%]">
				<div>
					<h2 className="text-[25px] font-semibold lg:text-[34px]">{productItem.brand}</h2>
					<StarRating className="mt-[4px] text-[16px]" rating={productItem.rating} text={"reviews"} />
				</div>
				<p className="text-[23px] font-medium lg:text-[30px]">
					<sup>$</sup>
					{productItem.price}
					<sup>.00</sup>
				</p>
			</div>

			<div className="mt-[20px]">
				<h2 className="text-[25px] font-semibold lg:text-[34px]">Description</h2>
				<p className="mt-[4px] text-[15px] font-light lg:text-[15.5px]">{productItem.description}</p>
			</div>

			<div className="mt-[35px] flex items-center gap-[40px] md:mt-[45px] lg:gap-[60px]">
				<div
					className="flex w-[140px] items-center justify-between rounded-[40px] bg-carousel-btn
						p-[6px_11px] text-[23px] font-semibold md:w-[170px] md:text-[26px]"
				>
					<Button
						unstyled={true}
						type="button"
						className="active:scale-[1.2] disabled:brightness-[0.5] disabled:active:transform-none"
						disabled={productQuantityChosen === 0}
						onClick={handleMinus}
					>
						<IconBox icon="mdi:minus-circle" />
					</Button>

					<p className="font-roboto">{productQuantityChosen}</p>

					<Button
						unstyled={true}
						type="button"
						className="active:scale-[1.2] disabled:brightness-[0.5] disabled:active:transform-none"
						disabled={productQuantityChosen === productItem.stock}
						onClick={handlePlus}
					>
						<IconBox icon="mdi:plus-circle" />
					</Button>
				</div>

				<div className="whitespace-nowrap">
					<p className="text-[14px] font-light tracking-wide md:text-[17px]">
						Only
						<span
							className="inline-block min-w-[38px] text-center text-[18px] font-medium
								text-[hsl(43,67%,50%)]"
						>
							{quantityLeftInStock}
						</span>
						Items Left
					</p>
					<span className="font-medium">{`Don't miss it`}!</span>
				</div>
			</div>

			<div className="mt-[40px] flex gap-[30px] font-medium md:mt-auto md:justify-between">
				<Button
					theme="secondary"
					variant="shop"
					className="w-[150px] p-[10px_0] shadow-[0_0_0_1.3px_var(--color-secondary)]
						transition-transform duration-200 ease-in-out hover:scale-[1.1] hover:bg-heading
						hover:text-primary hover:shadow-[0_0_0_1.3px_var(--color-secondary)] active:scale-[1.1]
						lg:w-[200px]"
				>
					<Link to="/checkout">Buy Now</Link>
				</Button>

				<Button
					theme="ghost"
					variant="shop"
					className="w-[150px] p-[10px_0] shadow-[0_0_0_1.3px_var(--color-primary)]
						transition-transform duration-200 ease-in-out hover:scale-[1.1] hover:bg-heading
						hover:text-primary hover:shadow-[0_0_0_1.3px_var(--color-secondary)] active:scale-[1.17]
						lg:w-[200px]"
					onClick={handlePlus}
				>
					<IconBox icon="mdi:cart-outline" className="mr-[10px] text-[20px]" />
					<p>Add to Cart</p>
				</Button>
			</div>
		</article>
	);
}
export default ItemDescription;
