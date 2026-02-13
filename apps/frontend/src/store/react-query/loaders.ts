import { getQueryClient } from "./queryClient";
import { productKeyEnum, productQuery, sessionQuery } from "./queryOptions";

const queryClient = getQueryClient();

export const composeLoaders = (...loaders: Array<() => void>) => {
	return () => loaders.forEach((loader) => loader());
};

export const sessionLoader = () => {
	void queryClient.prefetchQuery(sessionQuery());
};

export const productLoader = () => {
	productKeyEnum.forEach((key) => void queryClient.prefetchQuery(productQuery(key)));
};
