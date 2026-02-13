import type { Prettify } from "@zayne-labs/toolkit-type-helpers";
import type { RequestHandler as ExpressRequestHandler, NextFunction, Request, Response } from "express";

type ModifiedRequest<TRequestSupplement> = Omit<Request, "body" | "signedCookies">
	& Prettify<
		TRequestSupplement & {
			body: Record<string, unknown> | undefined;
			signedCookies: Record<string, string | undefined>;
		}
	>;

type RequestHandler<TRequestSupplement = unknown> = (
	req: ModifiedRequest<TRequestSupplement>,
	res: Response,
	next: NextFunction
	// eslint-disable-next-line ts-eslint/no-redundant-type-constituents
) => unknown | Promise<unknown>;

const catchAsync = <TRequestSupplement>(handlerFn: RequestHandler<TRequestSupplement>) => {
	const safeControllerFn: RequestHandler<TRequestSupplement> = async (req, res, next) => {
		try {
			const result = await handlerFn(req, res, next);

			return result;
			// Forward error to error handler
		} catch (error) {
			next(error);

			return null;
		}
	};

	return safeControllerFn as ExpressRequestHandler;
};

export { catchAsync };
