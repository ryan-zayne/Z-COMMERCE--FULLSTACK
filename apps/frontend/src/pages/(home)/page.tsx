import { Show } from "@/components/primitives/show";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useGetAllProducts } from "@/store/react-query/useGetAllProducts";
import Categories from "./_components/Categories";
import Hero from "./_components/Hero/Hero";
import HotSalesProducts from "./_components/ProductSections/HotSalesProducts";
import RecentProducts from "./_components/ProductSections/RecentProducts";
import SimilarProducts from "./_components/ProductSections/SimilarProducts";

function Home() {
	const {
		hotSalesProductsArray,
		isPending,
		recentlyViewedProductsArray,
		vehiclesProductsArray: similarProductsArray,
	} = useGetAllProducts();

	return (
		<>
			<Hero />

			<Categories />

			<section id="Products Section" className="flex flex-col gap-[100px] px-[30px] pt-[60px]">
				<Show.Root when={!isPending}>
					<HotSalesProducts data={hotSalesProductsArray} />
					<RecentProducts data={recentlyViewedProductsArray} />
					<SimilarProducts data={similarProductsArray} />

					<Show.Fallback>
						<LoadingSkeleton count={15} />
					</Show.Fallback>
				</Show.Root>
			</section>
		</>
	);
}

export default Home;
