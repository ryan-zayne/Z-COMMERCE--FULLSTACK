import { defineEnum } from "@zayne-labs/toolkit-type-helpers";
import { consola } from "consola";
import jwt from "jsonwebtoken";
import type { HydratedDocument } from "mongoose";
import { UserModel } from "@/app/auth/model";
import { decodeJwtToken, isTokenInWhitelist, type DecodedJwtPayload } from "@/app/auth/services/common";
import type { UserType } from "@/app/auth/types";
import { ENVIRONMENT } from "@/config/env";
import { AppError } from "@/utils";

// Error messages
const AUTH_ERROR_MESSAGES = defineEnum({
	ACCOUNT_SUSPENDED: "Your account is currently suspended",
	EMAIL_UNVERIFIED: "Your email is yet to be verified",
	GENERIC_ERROR: "An error occurred, please log in again",
	INVALID_TOKEN: "Invalid session. Please log in again!",
	SESSION_EXPIRED: "Session expired, please log in again",
	UNAUTHORIZED: "Unauthorized",
	USER_NOT_FOUND: "User not found or not logged in",
});

/**
 * @description This function is used to verify that user status
 * @returns The current user
 */
const getAndVerifyUserFromToken = async (decodedPayload: DecodedJwtPayload, zayneRefreshToken: string) => {
	const currentUser = await UserModel.findById(decodedPayload.id).select([
		"+refreshTokenArray",
		"+isEmailVerified",
		"+isSuspended",
	]);

	// == Check if user exists
	if (!currentUser) {
		throw new AppError(404, AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
	}

	// == At this point, the refresh token is still valid but is not in the refreshTokenArray (whitelist)
	// == So it can be seen as a token reuse situation
	// == So log out the user from all devices to greatly diminish the risk of another token reuse attack

	if (!isTokenInWhitelist(currentUser.refreshTokenArray, zayneRefreshToken)) {
		consola.warn("Possible token reuse detected!");
		consola.trace({ timestamp: new Date().toISOString(), userId: currentUser._id.toString() });

		await currentUser.updateOne({ refreshTokenArray: [] });

		throw new AppError(401, AUTH_ERROR_MESSAGES.INVALID_TOKEN);
	}

	if (currentUser.isSuspended) {
		throw new AppError(401, AUTH_ERROR_MESSAGES.ACCOUNT_SUSPENDED);
	}

	if (!currentUser.isEmailVerified) {
		throw new AppError(422, AUTH_ERROR_MESSAGES.EMAIL_UNVERIFIED);
	}

	// TODO csrf protection
	// TODO browser client fingerprinting

	return currentUser;
};

/**
 * @description This function is used to validate the refresh token and generate a new access token
 */
const refreshUserSession = async (zayneRefreshToken: string) => {
	try {
		const decodedRefreshPayload = decodeJwtToken(zayneRefreshToken, {
			secretKey: ENVIRONMENT.REFRESH_SECRET,
		});

		const currentUser = await getAndVerifyUserFromToken(decodedRefreshPayload, zayneRefreshToken);

		const newZayneAccessToken = currentUser.generateAccessToken();

		return {
			currentUser,
			newZayneAccessToken,
		};
	} catch (error) {
		// == If the refresh token is invalid, throw an error
		if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
			throw new AppError(401, AUTH_ERROR_MESSAGES.SESSION_EXPIRED, { cause: error });
		}

		if (error instanceof AppError) {
			throw error;
		}

		throw new AppError(401, AUTH_ERROR_MESSAGES.GENERIC_ERROR, { cause: error });
	}
};

type TokenPairFromCookies = {
	zayneAccessToken: string | undefined;
	zayneRefreshToken: string | undefined;
};

type AuthenticatedSession =
	| {
			currentUser: HydratedDocument<UserType>;
			newZayneAccessToken: null;
	  }
	| {
			currentUser: HydratedDocument<UserType>;
			newZayneAccessToken: string;
	  };

/**
 * @description Main authentication function that validates or refreshes user sessions
 * Handles both initial authentication and token refresh scenarios
 */
const validateUserSession = async (tokens: TokenPairFromCookies): Promise<AuthenticatedSession> => {
	const { zayneAccessToken, zayneRefreshToken } = tokens;

	if (!zayneRefreshToken) {
		throw new AppError(401, AUTH_ERROR_MESSAGES.UNAUTHORIZED);
	}

	// == If access token is not present, verify the refresh token and generate new tokens
	if (!zayneAccessToken) {
		const newSession = await refreshUserSession(zayneRefreshToken);

		return newSession;
	}

	try {
		// == Validate existing session
		const decodedAccessPayload = decodeJwtToken(zayneAccessToken, {
			secretKey: ENVIRONMENT.ACCESS_SECRET,
		});

		const currentUser = await getAndVerifyUserFromToken(decodedAccessPayload, zayneRefreshToken);

		return {
			currentUser,
			newZayneAccessToken: null,
		};
	} catch (error) {
		// == Attempt session renewal if the error indicates that the access token is invalid / expired
		if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
			const newSession = await refreshUserSession(zayneRefreshToken);

			return newSession;
		}

		if (error instanceof AppError) {
			throw error;
		}

		throw new AppError(401, AUTH_ERROR_MESSAGES.GENERIC_ERROR, { cause: error });
	}
};

export { validateUserSession };
