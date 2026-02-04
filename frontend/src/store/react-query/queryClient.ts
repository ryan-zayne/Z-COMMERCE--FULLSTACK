import { QueryClient } from "@tanstack/react-query";
import { isServer } from "@zayne-labs/toolkit-core";
import { cache } from "react";

const makeQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				gcTime: 10 * (60 * 1000),
				staleTime: Infinity,
			},
		},
	});
};

let browserQueryClient: QueryClient | undefined;

const makeQueryClientOnServer = cache(makeQueryClient);

export const getQueryClient = () => {
	if (isServer()) {
		return makeQueryClientOnServer();
	}

	browserQueryClient ??= makeQueryClient();

	return browserQueryClient;
};
