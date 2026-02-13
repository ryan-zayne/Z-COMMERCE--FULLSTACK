import { Button } from "@/components/primitives/button";
import { IconBox } from "@/components/primitives/IconBox";
import { useShopStore } from "@/store/zustand/shopStore";
import type { ShopStore } from "@/store/zustand/types";

type CartItemProps = {
	product: ShopStore["cart"][number];
};

function CartItem({ product }: CartItemProps) {
	const { removeProductFromCart } = useShopStore((state) => state.actions);

	const handleRemoveProduct = () => removeProductFromCart(product.id);

	return (
		<li
			className="flex items-center rounded-[5px] p-[10px] shadow-[0_2px_6px_hsl(0,0%,0%,0.3)]
				lg:p-[16px] dark:shadow-[0_1px_10px_hsl(0,0%,0%,0.6)]"
		>
			<img
				className="aspect-square w-[50px] rounded-[50%] lg:w-[70px]"
				src={product.thumbnail}
				alt=""
			/>

			<div className="ml-[10px] flex flex-col gap-[3px] text-[14px] lg:ml-[16px] lg:text-[15px]">
				<h4 className="font-roboto font-semibold lg:text-[17px]">{product.title}</h4>
				<p className="font-medium text-[hsl(0,0%,50%,0.7)]">${product.price}</p>
				<p>
					Quantity: <span className="ml-[2px] text-secondary">{product.quantity}</span>
				</p>
			</div>

			<Button
				unstyled={true}
				className="ml-auto text-[18px] text-rose-500 hover:text-rose-400 active:scale-[1.1]
					lg:text-[23px]"
				onClick={handleRemoveProduct}
			>
				<IconBox icon="tabler:trash-filled" />
			</Button>
		</li>
	);
}

export { CartItem };
