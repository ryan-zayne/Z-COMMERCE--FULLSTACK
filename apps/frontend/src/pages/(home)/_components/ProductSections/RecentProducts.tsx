import { assertDefined } from "@zayne-labs/toolkit-type-helpers";
import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { ProductCard } from "@/components/ui/ProductCard";
import type { DataArrayProp } from "./types";

function RecentProducts({ data }: DataArrayProp) {
	return (
		<article id="Recently Viewed" className="flex flex-col gap-[30px] px-[30px]">
			<h2 className="text-[25px] font-bold max-md:text-center lg:text-[30px]">Recently Viewed</h2>

			<ForWithWrapper
				each={data}
				className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] justify-items-center gap-[30px]
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
