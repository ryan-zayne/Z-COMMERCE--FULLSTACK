import { defineEnum, type UnionDiscriminator } from "@zayne-labs/toolkit-type-helpers";
import jwt from "jsonwebtoken";
import type { HydratedDocument } from "mongoose";
import { UserModel } from "@/app/auth/model";
import type { generateAccessToken } from "@/app/auth/services/common";
import { decodeJwtToken, isTokenInWhitelist } from "@/app/auth/services/token";
import type { UserType } from "@/app/auth/types";
import { ENVIRONMENT } from "@/config/env";
import { AppError } from "@/utils";

const AUTH_ERROR_MESSAGES = defineEnum({
	ACCOUNT_SUSPENDED: "Your account is currently suspended",
	EMAIL_UNVERIFIED: "Your email is yet to be verified",
	GENERIC_ERROR: "An error occurred. Please log in again",
	INVALID_SESSION: "Invalid session. Please log in again",
	SESSION_EXPIRED: "Session expired. Please log in again",
	SESSION_NOT_EXIST: "Session doesn't exist. Please log in",
});

type VerifyOptions = UnionDiscriminator<
	[
		{
			variant: "accessToken";
			zayneAccessToken: string;
			zayneRefreshToken: string;
		},
		{
			variant: "refreshToken";
			zayneRefreshToken: string;
		},
	]
>;

const getAndVerifyUserFromToken = async (options: VerifyOptions) => {
	const { variant, zayneAccessToken, zayneRefreshToken } = options;

	const decodedPayload =
		variant === "accessToken" ?
			decodeJwtToken(zayneAccessToken, { secretKey: ENVIRONMENT.ACCESS_SECRET })
		:	decodeJwtToken(zayneRefreshToken, { secretKey: ENVIRONMENT.REFRESH_SECRET });

	const currentUser = await UserModel.findById(decodedPayload.id).select([
		"+refreshTokenArray",
		"+isEmailVerified",
		"+isSuspended",
	]);

	if (!currentUser) {
		throw new AppError({
			code: 401,
			message: AUTH_ERROR_MESSAGES.SESSION_NOT_EXIST,
		});
	}

	// == At this point, the refresh token is still valid but is not in the refreshTokenArray (whitelist)
	// == So it can be seen as a token reuse situation
	// == So clear the refreshTokenArray to log out the user from all devices including current device, greatly diminishing the risk of another token reuse attack

	if (!isTokenInWhitelist(currentUser.refreshTokenArray, zayneRefreshToken)) {
		await currentUser.updateOne({ refreshTokenArray: [] });

		throw new AppError({
			code: 401,
			message: AUTH_ERROR_MESSAGES.INVALID_SESSION,
		});
	}

	if (currentUser.isSuspended) {
		throw new AppError({
			code: 401,
			message: AUTH_ERROR_MESSAGES.ACCOUNT_SUSPENDED,
		});
	}

	if (!currentUser.isEmailVerified) {
		throw new AppError({
			code: 422,
			message: AUTH_ERROR_MESSAGES.EMAIL_UNVERIFIED,
		});
	}

	// TODO csrf protection
	// TODO browser client fingerprinting

	return currentUser;
};

type NewSession = {
	currentUser: HydratedDocument<UserType>;
	newZayneAccessTokenResult: ReturnType<typeof generateAccessToken>;
};

/**
 * @description This function is used to validate the refresh token and generate a new access token
 */
export const refreshUserSession = async (zayneRefreshToken: string): Promise<NewSession> => {
	try {
		const currentUser = await getAndVerifyUserFromToken({ variant: "refreshToken", zayneRefreshToken });

		const newZayneAccessTokenResult = currentUser.generateAccessToken();

		return {
			currentUser,
			newZayneAccessTokenResult,
		};
	} catch (error) {
		// == If the refresh token is invalid, throw an error
		if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
			throw new AppError({
				cause: error,
				code: 401,
				message: AUTH_ERROR_MESSAGES.SESSION_EXPIRED,
			});
		}

		if (AppError.isError(error)) {
			throw error;
		}

		throw new AppError({
			cause: error,
			code: 401,
			message: AUTH_ERROR_MESSAGES.GENERIC_ERROR,
		});
	}
};

type ExistingSession = {
	currentUser: HydratedDocument<UserType>;
	newZayneAccessTokenResult: null;
};

type TokenPairFromCookies = {
	zayneAccessToken: string | undefined;
	zayneRefreshToken: string | undefined;
};

/**
 * @description Main authentication function that validates or refreshes user sessions
 * Handles both initial authentication and token refresh scenarios
 */
const validateUserSession = async (
	tokens: TokenPairFromCookies
): Promise<ExistingSession | NewSession> => {
	const { zayneAccessToken, zayneRefreshToken } = tokens;

	if (!zayneRefreshToken) {
		throw new AppError({
			code: 401,
			message: AUTH_ERROR_MESSAGES.SESSION_NOT_EXIST,
		});
	}

	// == If access token is not present, verify the refresh token and generate new session
	if (!zayneAccessToken) {
		const newSession = await refreshUserSession(zayneRefreshToken);

		return newSession;
	}

	try {
		const currentUser = await getAndVerifyUserFromToken({
			variant: "accessToken",
			zayneAccessToken,
			zayneRefreshToken,
		});

		// == Return Existing session if accessToken is still valid
		return {
			currentUser,
			newZayneAccessTokenResult: null,
		};
	} catch (error) {
		// == Attempt to generate new session if the error indicates that the access token is invalid / expired
		if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
			const newSession = await refreshUserSession(zayneRefreshToken);

			return newSession;
		}

		if (AppError.isError(error)) {
			throw error;
		}

		throw new AppError({
			cause: error,
			code: 401,
			message: AUTH_ERROR_MESSAGES.GENERIC_ERROR,
		});
	}
};

export { validateUserSession };
