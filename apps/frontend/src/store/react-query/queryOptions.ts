import { queryOptions } from "@tanstack/react-query";
import { defineEnum } from "@zayne-labs/toolkit-type-helpers";
import { checkUserSessionForQuery } from "@/lib/api/callBackendApi/plugins/utils/session";
import { callDummyApi } from "@/lib/api/callDummyApi";

// TODO - Remove once you start serving the products from your backend

const watchesProductKeys = defineEnum(["mens-watches", "womens-watches"]);
const vehiclesProductKeys = defineEnum(["automotive", "motorcycle"]);

export const productKeyEnum = defineEnum([
	"smartphones",
	"laptops",
	"tablets",
	...watchesProductKeys,
	...vehiclesProductKeys,
]);

export const sessionQuery = () => {
	return queryOptions({
		queryFn: () => checkUserSessionForQuery(),
		queryKey: ["session"],
		retry: false,
		staleTime: 1 * 60 * 1000,
	});
};

export const productQuery = <TKey extends (typeof productKeyEnum)[number]>(key: TKey) => {
	const productKey = [key, { url: `/products/category/${key}` }];

	return queryOptions({
		queryFn: () => callDummyApi("/products/category/:key", { params: { key } }),
		queryKey: productKey,
		select: (data) => data.products,
	});
};
