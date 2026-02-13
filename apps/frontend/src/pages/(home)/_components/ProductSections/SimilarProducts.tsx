import { assertDefined } from "@zayne-labs/toolkit-type-helpers";
import { ForWithWrapper } from "@/components/primitives/for";
import { ProductCard } from "@/components/ui/ProductCard";
import type { DataArrayProp } from "./types";

function SimilarProducts({ data }: DataArrayProp) {
	return (
		<article id="Similar Products You Might Like" className="flex flex-col gap-[30px] px-[30px]">
			<h2 className="text-[25px] font-bold max-md:text-center lg:text-[30px]">
				Similar Products You Might Like
			</h2>

			<ForWithWrapper
				className="grid grid-cols-[repeat(auto-fit,minmax(236px,1fr))] justify-items-center gap-[30px]
					lg:gap-[50px]"
				each={data}
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
export default SimilarProducts;
