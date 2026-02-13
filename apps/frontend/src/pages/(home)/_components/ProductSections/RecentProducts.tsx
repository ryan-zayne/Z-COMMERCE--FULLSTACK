import { assertDefined } from "@zayne-labs/toolkit-type-helpers";
import { ProductCard } from "@/components/common/ProductCard";
import { ForWithWrapper } from "@/components/primitives/for";
import type { DataArrayProp } from "./types";

function RecentProducts({ data }: DataArrayProp) {
	return (
		<article id="Recently Viewed" className="flex flex-col gap-7.5 px-7.5">
			<h2 className="text-[25px] font-bold max-md:text-center lg:text-[30px]">Recently Viewed</h2>

			<ForWithWrapper
				each={data}
				className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] justify-items-center gap-7.5
					lg:gap-[50px]"
				renderItem={(product) => (
					<ProductCard
						key={product?.id}
						link={`/products/${product?.category}/${product?.id}`}
						image={product?.images[1] ?? ""}
						productItem={assertDefined(product)}
					/>
				)}
			/>
		</article>
	);
}
export default RecentProducts;
