import type { ResponseErrorContext } from "@zayne-labs/callapi";
import { definePlugin } from "@zayne-labs/callapi/utils";
import { isObject, type AnyFunction, type UnionDiscriminator } from "@zayne-labs/toolkit-type-helpers";
import { toast } from "sonner";

type Context = {
	routesToSkip?: string[];
};

const defaultRoutesToSkip = ["/auth/signin", "/auth/signup"];

export type RedirectOn401ErrorPluginMeta = {
	redirectOn401Error?:
		| boolean
		| UnionDiscriminator<
				[
					{
						errorMessage?: string | null;
						navigateFn?: AnyFunction;
						onError: () => void;
					},
					{
						errorMessage?: string | null;
						navigateFn?: AnyFunction;
						path?: `/${string}`;
					},
				]
		  >;
};

export const redirectOn401ErrorPlugin = (context?: Context) => {
	const routesToSkip = [...defaultRoutesToSkip, ...(context?.routesToSkip ?? [])];

	return definePlugin({
		hooks: {
			onResponseError: ({
				options,
				response,
			}: ResponseErrorContext<{ Meta: RedirectOn401ErrorPluginMeta }>) => {
				const shouldRedirect =
					response.status === 401 && !routesToSkip.some((route) => options.fullURL?.endsWith(route));

				if (!shouldRedirect || options.meta?.redirectOn401Error === false) return;

				const redirectOn401ErrorMeta =
					isObject(options.meta?.redirectOn401Error) ? options.meta.redirectOn401Error : {};

				const { navigateFn, onError, path } = redirectOn401ErrorMeta;

				if (onError) {
					onError();
					return;
				}

				const message = redirectOn401ErrorMeta.errorMessage;

				message && toast.error(message, { duration: 2000 });

				navigateFn?.(path ?? "/auth/signin");
			},
		},

		id: "redirect-on-401-error",

		name: "redirectOn401ErrorPlugin",
	});
};
