import { consola } from "consola";
import type { ErrorRequestHandler } from "express";
import { errorCodes, type ErrorCodesUnion } from "../../constants";
import { AppError } from "../../utils";
import { transformError } from "./transformError";

const errorHandler: ErrorRequestHandler = (error: AppError, _req, res, _next) => {
	const modifiedError = transformError(error);

	/* eslint-disable ts-eslint/no-unnecessary-condition */
	/* eslint-disable perfectionist/sort-objects */
	const errorInfo = {
		status: "error",
		message: modifiedError.message ?? "Something went very wrong!",
		...(Boolean(modifiedError.errors) && { errors: modifiedError.errors }),
	};
	/* eslint-enable ts-eslint/no-unnecessary-condition */

	consola.error(`${error.name}:`, {
		...errorInfo,
		...(Boolean(modifiedError.cause) && { cause: modifiedError.cause }),
		stack: modifiedError.stack,
	});

	/* eslint-enable perfectionist/sort-objects */
	const ERROR_LOOKUP = new Map([
		[errorCodes.BAD_REQUEST, () => res.status(400).json(errorInfo)],

		[errorCodes.CONFLICT, () => res.status(409).json(errorInfo)],

		[errorCodes.FORBIDDEN, () => res.status(403).json(errorInfo)],

		[errorCodes.NOT_FOUND, () => res.status(404).json(errorInfo)],

		[errorCodes.PAYMENT_REQUIRED, () => res.status(402).json(errorInfo)],

		[errorCodes.REQUEST_TIMEOUT, () => res.status(408).json(errorInfo)],

		[errorCodes.SERVER_ERROR, () => res.status(500).json(errorInfo)],

		[errorCodes.UNAUTHORIZED, () => res.status(401).json(errorInfo)],

		[errorCodes.VALIDATION_ERROR, () => res.status(422).json(errorInfo)],
	]) satisfies Map<ErrorCodesUnion, () => void>;

	const statusCodeHandler =
		ERROR_LOOKUP.get(modifiedError.statusCode) ?? ERROR_LOOKUP.get(errorCodes.SERVER_ERROR);

	return statusCodeHandler?.() as never;
};

export { errorHandler };
