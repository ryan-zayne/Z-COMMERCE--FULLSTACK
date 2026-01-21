import {
	createFetchClientWithContext,
	type CallApiParameters,
	type GetCallApiContext,
	type ResultModeType,
} from "@zayne-labs/callapi";
import {
	redirectOn401ErrorPlugin,
	toastPlugin,
	type RedirectOn401ErrorPluginMeta,
	type ToastPluginMeta,
} from "./plugins";

export type BaseApiSuccessResponse<TData = unknown> = {
	data?: TData;
	message: string;
	status: "success";
	success: true;
};

export type BaseApiErrorResponse<TError = Record<string, string>> = {
	errors?: TError;
	message: string;
	status: "error";
	success: false;
};

type GlobalMeta = RedirectOn401ErrorPluginMeta & ToastPluginMeta;

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

const sharedFetchClient = createFetchClientWithContext<GetCallApiContext<{ Meta: GlobalMeta }>>()({
	baseURL: BASE_API_URL,
	credentials: "include",
	plugins: [redirectOn401ErrorPlugin(), toastPlugin()],
});

export const callBackendApi = <
	TData = unknown,
	TErrorData = unknown,
	TResultMode extends ResultModeType = ResultModeType,
>(
	...parameters: CallApiParameters<
		BaseApiSuccessResponse<TData>,
		BaseApiErrorResponse<TErrorData>,
		TResultMode
	>
) => {
	const [url, config] = parameters;

	return sharedFetchClient(url, config);
};

export const callBackendApiForQuery = <TData = unknown>(
	...parameters: CallApiParameters<BaseApiSuccessResponse<TData>, false | undefined>
) => {
	const [url, config] = parameters;

	return sharedFetchClient(url, {
		resultMode: "onlyData",
		throwOnError: true,
		...config,
	});
};
