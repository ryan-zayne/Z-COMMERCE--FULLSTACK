import { isObject } from "@zayne-labs/toolkit-type-helpers";
import jwt from "jsonwebtoken";
import { Error as MongooseError } from "mongoose";
import { errorCodes } from "../../constants";
import { AppError } from "../../utils";

const handleMongooseCastError = (error: MongooseError.CastError) => {
	const message = `Invalid ${error.path} value "${error.value as string}".`;

	return new AppError({ code: 400, message });
};

const handleMongooseValidationError = (error: MongooseError.ValidationError) => {
	const errors = Object.values(error.errors).map((e) => e.message);

	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError({ code: 400, message });
};

const handleMongooseDuplicateFieldsError = (error: MongooseError) => {
	const isDuplicateFieldError =
		"code" in error && error.code === 11000 && "keyValue" in error && error.keyValue;

	if (!isDuplicateFieldError) {
		return new AppError({ cause: error, code: errorCodes.SERVER_ERROR, message: error.message });
	}

	if (!isObject(error.keyValue)) {
		return new AppError({ cause: error, code: errorCodes.SERVER_ERROR, message: error.message });
	}

	const firstKeyValueEntry = Object.entries(error.keyValue)[0];

	if (!firstKeyValueEntry) {
		return new AppError({ cause: error, code: errorCodes.SERVER_ERROR, message: error.message });
	}

	// == Extract value from the error message if it matches a pattern
	// eslint-disable-next-line ts-eslint/no-unsafe-assignment
	const [field, value] = firstKeyValueEntry;

	const formattedField = field
		.replaceAll(/([a-z])([A-Z])/g, "$1 $2")
		.split(/(?=[A-Z])/)
		.map((word, index) =>
			index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toLowerCase()
		)
		.join("");

	return new AppError({
		cause: error,
		code: 409,
		message: `${formattedField} "${value as string}" has already been used!`,
	});
};

const handleTimeoutError = (error: Error) => {
	return new AppError({ cause: error, code: 408, message: "Request timeout" });
};

const handleJWTError = (error: jwt.JsonWebTokenError) => {
	return new AppError({ cause: error, code: 401, message: "Invalid token!" });
};

const handleJWTExpiredError = (error: jwt.TokenExpiredError) => {
	return new AppError({ cause: error, code: 401, message: " Your token has expired!" });
};

export const transformError = (error: AppError) => {
	let modifiedError = error;

	switch (true) {
		case error instanceof MongooseError.CastError: {
			modifiedError = handleMongooseCastError(error);
			break;
		}

		case error instanceof MongooseError.ValidationError: {
			modifiedError = handleMongooseValidationError(error);
			break;
		}

		case "timeout" in error && error.timeout: {
			modifiedError = handleTimeoutError(error);
			break;
		}

		case error instanceof jwt.JsonWebTokenError: {
			modifiedError = handleJWTError(error);
			break;
		}

		case error instanceof jwt.TokenExpiredError: {
			modifiedError = handleJWTExpiredError(error);
			break;
		}

		case error instanceof MongooseError: {
			modifiedError = handleMongooseDuplicateFieldsError(error);
			break;
		}

		default: {
			break;
		}
	}

	return modifiedError;
};
