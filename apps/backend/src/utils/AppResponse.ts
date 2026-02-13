import type {
	BackendApiRouteKeys,
	BackendApiRoutes,
} from "@z-commerce/shared/validation/backendApiSchema";
import type { CallApiSchema } from "@zayne-labs/callapi";
import type { AnyNumber } from "@zayne-labs/toolkit-type-helpers";
import type { Response } from "express";
import { z } from "zod";
import type { ErrorCodesUnion } from "@/constants";

const AppResponse = <
	TSchema extends Extract<BackendApiRoutes[BackendApiRouteKeys], Pick<CallApiSchema, "data">>["data"],
	TDataSchema extends TSchema["shape"]["data"],
>(
	res: Response,
	options: {
		code?: AnyNumber | ErrorCodesUnion;
		data: z.infer<TDataSchema>;
		message: string;
	}
) => {
	const { code: statusCode = 200, data, message } = options;

	const validatedData = data;

	/* eslint-disable perfectionist/sort-objects */
	const jsonBody = {
		status: "success",
		message,
		data: validatedData,
	};
	/* eslint-enable perfectionist/sort-objects */

	return res.status(statusCode).json(jsonBody);
};

export { AppResponse };
