import type {
	CallApiResultErrorVariant,
	ErrorContext,
	RequestContext,
	SuccessContext,
} from "@zayne-labs/callapi";
import { definePlugin, isHTTPError } from "@zayne-labs/callapi/utils";
import { isBrowser } from "@zayne-labs/toolkit-core";
import { isBoolean } from "@zayne-labs/toolkit-type-helpers";
import { toast } from "sonner";
import type { BaseApiErrorResponse, BaseApiSuccessResponse } from "../apiSchema";

export type ToastPluginMeta = {
	toast?: {
		endpointsToSkip?: {
			error?: Array<string | undefined>;
			errorAndSuccess?: Array<string | undefined>;
			success?: Array<string | undefined>;
		};
		error?: boolean;
		errorAndSuccess?: boolean;
		errorsToSkip?: Array<CallApiResultErrorVariant<unknown>["error"]["name"]>;
		errorsToSkipCondition?: (
			error: CallApiResultErrorVariant<BaseApiErrorResponse>["error"]
		) => boolean | undefined;
		success?: boolean;
	};
};

export const toastPlugin = (toastOptions?: ToastPluginMeta["toast"]) => {
	const getToastMeta = (ctx: RequestContext<{ Meta: ToastPluginMeta }>) => {
		return toastOptions ? { ...toastOptions, ...ctx.options.meta?.toast } : ctx.options.meta?.toast;
	};

	return definePlugin({
		id: "toast-plugin",
		name: "toastPlugin",

		// eslint-disable-next-line perfectionist/sort-objects
		hooks: {
			onError: (ctx: ErrorContext<{ ErrorData: BaseApiErrorResponse }>) => {
				if (!isBrowser()) return;

				const toastMeta = getToastMeta(ctx);

				/* eslint-disable ts-eslint/prefer-nullish-coalescing */
				const shouldSkipErrorToast =
					(isBoolean(toastMeta?.error) && !toastMeta.error)
					|| (isBoolean(toastMeta?.errorAndSuccess) && !toastMeta.errorAndSuccess)
					|| toastMeta?.endpointsToSkip?.error?.includes(ctx.options.initURLNormalized)
					|| toastMeta?.endpointsToSkip?.errorAndSuccess?.includes(ctx.options.initURLNormalized)
					|| toastMeta?.errorsToSkip?.includes(ctx.error.name)
					|| toastMeta?.errorsToSkipCondition?.(ctx.error);
				/* eslint-enable ts-eslint/prefer-nullish-coalescing */

				if (shouldSkipErrorToast) return;

				if (isHTTPError(ctx.error) && ctx.error.errorData.errors) {
					Object.values(ctx.error.errorData.errors).forEach((message) => toast.error(message));

					return;
				}

				toast.error(ctx.error.message);
			},

			onSuccess: (ctx: SuccessContext<{ Data: BaseApiSuccessResponse }>) => {
				if (!isBrowser()) return;

				const toastMeta = getToastMeta(ctx);

				/* eslint-disable ts-eslint/prefer-nullish-coalescing */
				const shouldSkipSuccessToast =
					(isBoolean(toastMeta?.success) && !toastMeta.success)
					|| (isBoolean(toastMeta?.errorAndSuccess) && !toastMeta.errorAndSuccess)
					|| toastMeta?.endpointsToSkip?.success?.includes(ctx.options.initURLNormalized)
					|| toastMeta?.endpointsToSkip?.errorAndSuccess?.includes(ctx.options.initURLNormalized);
				/* eslint-enable ts-eslint/prefer-nullish-coalescing */

				if (shouldSkipSuccessToast) return;

				toast.success(ctx.data.message);
			},
		},
	});
};
