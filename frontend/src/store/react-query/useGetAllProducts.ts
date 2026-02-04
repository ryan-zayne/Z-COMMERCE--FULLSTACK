import { useQueries } from "@tanstack/react-query";
import { productKeyEnum, productQuery } from "./queryOptions";

const useGetAllProducts = () => {
	const {
		data: allProductsArray,
		isError,
		isPending,
	} = useQueries({
		combine: (resultsArray) => ({
			data: resultsArray.flatMap((result) => result.data),
			isError: resultsArray.some((result) => result.isError),
			isPending: resultsArray.some((result) => result.isPending),
		}),
		queries: productKeyEnum.map((key) => productQuery(key)),
	});

	const recentlyViewedProductsArray = allProductsArray.filter(
		(product) => product?.category === "smartphones"
	);

	const hotSalesProductsArray = allProductsArray.filter((product) => product?.category === "laptops");

	const vehiclesProductsArray = [
		...allProductsArray.filter((product) => product?.category === "motorcycle"),
		...allProductsArray.filter((product) => product?.category === "automotive"),
	];

	const watchesProductsArray = [
		...allProductsArray.filter((product) => product?.category === "mens-watches"),
		...allProductsArray.filter((product) => product?.category === "womens-watches"),
	];

	return {
		allProductsArray,
		hotSalesProductsArray,
		isError,
		isPending,
		recentlyViewedProductsArray,
		vehiclesProductsArray,
		watchesProductsArray,
	};
};

export { useGetAllProducts };
