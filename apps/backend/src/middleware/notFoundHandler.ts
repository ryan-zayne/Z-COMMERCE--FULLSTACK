import type { Request } from "express";
import { AppError } from "../utils";
import { catchAsync } from "./catchAsyncErrors";

const notFoundHandler = catchAsync((req: Request) => {
	const message = `No '${req.method.toUpperCase()}' request handler defined for '${req.originalUrl}'. Check the API documentation for more details.`;

	throw new AppError({ code: 404, message });
});

export { notFoundHandler };
