import { defineEnum } from "@zayne-labs/toolkit-type-helpers";

export const errorCodes = defineEnum(
	{
		BAD_REQUEST: 400,
		CONFLICT: 409,
		FORBIDDEN: 403,
		NOT_FOUND: 404,
		PAYMENT_REQUIRED: 402,
		REQUEST_TIMEOUT: 408,
		SERVER_ERROR: 500,
		UNAUTHORIZED: 401,
		VALIDATION_ERROR: 422,
	},
	{ inferredUnionVariant: "values" }
);

export type ErrorCodesUnion = typeof errorCodes.$inferUnion;
