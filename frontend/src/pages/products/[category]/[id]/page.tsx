import { assertDefined } from "@zayne-labs/toolkit-type-helpers";
import { useParams } from "react-router";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useGetAllProducts } from "@/store/react-query/useGetAllProducts";
import ItemDescription from "./ProductItem/ItemDescription";
import ItemHeader from "./ProductItem/ItemHeader";
import ItemHero from "./ProductItem/ItemHero";

function ProductItemPage() {
	const { id: productId } = useParams();

	const { allProductsArray, isPending } = useGetAllProducts();

	if (isPending) {
		return <LoadingSkeleton variant={"productItemPage"} />;
	}

	const productItem = allProductsArray.find((item) => item?.id === Number(productId));

	if (!productItem) {
		throw new Error("Product not found!");
	}

	return (
		<section className="p-[10px_20px_80px] lg:pt-[30px]">
			<header className="mx-[5px] flex items-center justify-between lg:mx-[30px]">
				<ItemHeader productItem={assertDefined(productItem)} />
			</header>

			<div
				className="mt-[30px] md:mt-[45px] md:flex md:h-[470px] md:justify-around md:gap-[40px]
					md:px-[10px] lg:mt-[60px] lg:gap-[80px]"
			>
				<ItemHero slideImages={productItem.images} />

				<ItemDescription productItem={assertDefined(productItem)} />
			</div>
		</section>
	);
}

export default ProductItemPage;
