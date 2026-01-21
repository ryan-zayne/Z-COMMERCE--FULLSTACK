import { useGetAllProducts } from "./useGetAllProducts";

const useGetProductByCategory = (options: {
	category: string | undefined;
	productCategories: Set<string>;
}) => {
	const { category, productCategories } = options;

	if (!category || !productCategories.has(category)) {
		throw new Error("Category not found!");
	}

	const { allProductsArray, vehiclesProductsArray, watchesProductsArray, ...restOfResult } =
		useGetAllProducts();

	const PRODUCTS_LOOKUP = new Map<string, typeof allProductsArray>()
		.set(
			category,
			allProductsArray.filter((item) => item?.category === category)
		)
		.set("vehicles", vehiclesProductsArray)
		.set("watches", watchesProductsArray);

	return {
		category,
		productsArrayByCategory: PRODUCTS_LOOKUP.get(category) ?? [],
		...restOfResult,
	};
};

export { useGetProductByCategory };
