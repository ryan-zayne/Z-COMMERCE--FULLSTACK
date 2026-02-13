import { assertDefined } from "@zayne-labs/toolkit-type-helpers";
import { Link } from "react-router";
import { IconBox } from "@/components/common/IconBox";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ProductCard } from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import { useGetAllProducts } from "@/store/react-query/useGetAllProducts";

function AllProductsPage() {
	const { allProductsArray, isPending } = useGetAllProducts();

	if (isPending) {
		return <LoadingSkeleton count={10} />;
	}

	const allProductCards = allProductsArray.map((product) => (
		<ProductCard
			key={product?.id}
			link={`${product?.category}/${product?.id}`}
			image={product?.images[1] ?? ""}
			productItem={assertDefined(product)}
		/>
	));

	return (
		<section className="mt-[30px]">
			<header className="flex flex-row-reverse items-center justify-center px-[30px]">
				<h1 className="mx-auto text-[30px] font-bold lg:text-[40px]">All Products</h1>
				<Button unstyled={true} className="text-[30px]">
					<Link to={"/"}>
						<IconBox icon="typcn:arrow-back" />
					</Link>
				</Button>
			</header>

			<article className="mt-[80px] px-[30px]">
				<ul
					className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] justify-items-center
						gap-[50px_20px]"
				>
					{allProductCards}
				</ul>
			</article>
		</section>
	);
}

export default AllProductsPage;
