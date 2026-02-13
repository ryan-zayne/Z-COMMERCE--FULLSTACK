import { assertDefined, type ExtractUnion } from "@zayne-labs/toolkit-type-helpers";
import { getElementList } from "@zayne-labs/ui-react/common/for";
import { Link, useParams } from "react-router";
import { IconBox } from "@/components/common/IconBox";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ProductCard } from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import { useGetProductByCategory } from "@/store/react-query/useGetProductByCategory";

// TODO - Remove once you start serving the products from your backend
const productCategories = new Set(["smartphones", "laptops", "lighting", "watches", "vehicles"] as const);

function ProductCategoryPage() {
	const { category } = useParams<{ category: ExtractUnion<typeof productCategories> }>();

	const { isPending, productsArrayByCategory } = useGetProductByCategory({
		category,
		productCategories,
	});

	const [ProductCategoryCardList] = getElementList();

	if (isPending) {
		return <LoadingSkeleton count={category === "watches" || category === "vehicles" ? 10 : 5} />;
	}

	return (
		<section className="mt-[30px] lg:mt-[50px]">
			<header className="flex items-center justify-center">
				<Button unstyled={true} className="ml-[30px] text-[30px]">
					<Link to={"/"}>
						<IconBox icon="typcn:arrow-back" />
					</Link>
				</Button>

				<h1 className="mx-auto text-center text-[30px] font-bold capitalize lg:text-[40px]">
					{category === "lighting" ? "Digital Lighting" : category}
				</h1>
			</header>

			<article className="mt-[40px] px-[30px]">
				<ProductCategoryCardList
					className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] justify-items-center
						gap-[50px_20px]"
					each={productsArrayByCategory}
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
		</section>
	);
}

export default ProductCategoryPage;
