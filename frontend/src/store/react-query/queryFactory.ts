import { queryOptions } from "@tanstack/react-query";
import type { CallApiExtraOptions } from "@zayne-labs/callapi";
import { hardNavigate } from "@zayne-labs/toolkit-core";
import { defineEnum } from "@zayne-labs/toolkit-type-helpers";
import { toast } from "sonner";
import {
	callBackendApiForQuery,
	type BaseApiSuccessResponse,
	type SessionData,
} from "@/lib/api/callBackendApi";
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

export const sessionQuery = (
	options?: Pick<
		CallApiExtraOptions<{ Data: BaseApiSuccessResponse<SessionData> }>,
		"meta" | "onError" | "onRequestError" | "onResponseError" | "onSuccess"
	>
) => {
	const sessionKey = ["session"];

	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery<SessionData>("/auth/session", {
				meta: { redirectOn401Error: false, ...options?.meta },
				onError: options?.onError,
				onRequestError: options?.onRequestError,
				onResponseError: options?.onResponseError,
				onSuccess: options?.onSuccess,
			});
		},
		// eslint-disable-next-line tanstack-query/exhaustive-deps
		queryKey: sessionKey,
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

export const verifyEmailQuery = (token: string | undefined) => {
	const verifyEmailKey = ["verify-email", { token }];

	return queryOptions({
		enabled: Boolean(token),
		queryFn: () => {
			return callBackendApiForQuery("/auth/verify-email", {
				body: { token },
				meta: { redirectOn401Error: false },
				method: "POST",

				onError: ({ error }) => {
					toast.error(error.message);
					// void navigate("/auth/verify-email");
				},

				onSuccess: ({ data }) => {
					toast.success(data.message);
					hardNavigate("/auth/verify-email/success");
				},
			});
		},
		queryKey: verifyEmailKey,
		retry: false,
	});
};
