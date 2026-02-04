import { defineInstanceConfig } from "@zayne-labs/callapi/utils";
import { callBackendApi, callBackendApiForQuery } from "../../callBackendApi";

export const sessionDedupeOptions = defineInstanceConfig({
	dedupeKey: (ctx) => ctx.options.initURL,
	dedupeStrategy: "defer",
});

export const checkUserSessionForQuery = () => {
	return callBackendApiForQuery("@get/auth/session", {
		...sessionDedupeOptions,
		meta: { toast: { success: false } },
	});
};

export const checkUserSession = () => {
	return callBackendApi("@get/auth/session", {
		...sessionDedupeOptions,
		meta: { toast: { success: false } },
	});
};
