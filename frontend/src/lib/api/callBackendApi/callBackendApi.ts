import { createFetchClientWithContext, type GetCallApiContext } from "@zayne-labs/callapi";
import { loggerPlugin } from "@zayne-labs/callapi-plugins";
import { defineBaseConfig } from "@zayne-labs/callapi/utils";
import { backendApiSchema } from "./apiSchema";
import {
	authErrorRedirectPlugin,
	toastPlugin,
	type AuthErrorRedirectPluginMeta,
	type ToastPluginMeta,
} from "./plugins";

type GlobalMeta = AuthErrorRedirectPluginMeta & ToastPluginMeta;

// declare module "@zayne-labs/callapi" {
// 	// eslint-disable-next-line ts-eslint/consistent-type-definitions
// 	interface Register {
// 		meta: GlobalMeta;
// 	}
// }

const REMOTE_BACKEND_HOST = "https://api-zayne-commerce.onrender.com";

const LOCAL_BACKEND_HOST = "http://localhost:8000";

const BACKEND_HOST = process.env.NODE_ENV === "development" ? LOCAL_BACKEND_HOST : REMOTE_BACKEND_HOST;
// const BACKEND_HOST = REMOTE_BACKEND_HOST;

const BASE_API_URL = `${BACKEND_HOST}/api/v1`;

const createFetchClient = createFetchClientWithContext<GetCallApiContext<{ Meta: GlobalMeta }>>();

export const sharedBaseConfig = defineBaseConfig({
	baseURL: BASE_API_URL,
	credentials: "include",

	dedupeCacheScope: "global",
	dedupeCacheScopeKey: (ctx) => ctx.options.baseURL,

	plugins: [
		authErrorRedirectPlugin({
			redirectRoute: "/auth/signin",
			routesToExemptFromErrorRedirect: ["/", "/auth/**"],
		}),
		toastPlugin({
			errorAndSuccess: true,
			errorsToSkip: ["AbortError"],
		}),
		loggerPlugin({
			enabled: { onError: true },
		}),
	],

	schema: backendApiSchema,
});

export const callBackendApi = createFetchClient(sharedBaseConfig);

export const callBackendApiForQuery = createFetchClient({
	...sharedBaseConfig,
	resultMode: "onlyData",
	throwOnError: true,
});
