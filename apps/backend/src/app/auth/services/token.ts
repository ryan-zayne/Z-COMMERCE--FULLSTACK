import { pickKeys } from "@zayne-labs/toolkit-core";
import { consola } from "consola";
import jwt from "jsonwebtoken";
import type { HydratedDocument } from "mongoose";
import { ENVIRONMENT } from "@/config/env";
import type { HydratedUserType, UserType } from "../types";

type JwtOptions<TExtraOptions> = TExtraOptions & {
	secretKey: string;
};

export type DecodedJwtPayload = {
	id: string;
};

export const decodeJwtToken = <TDecodedPayload extends Record<string, unknown> = DecodedJwtPayload>(
	token: string,
	options: JwtOptions<jwt.VerifyOptions>
) => {
	const { secretKey, ...restOfOptions } = options;

	const decodedPayload = jwt.verify(token, secretKey, restOfOptions) as TDecodedPayload;

	return decodedPayload;
};

export const encodeJwtToken = <TDecodedPayload extends Record<string, unknown> = DecodedJwtPayload>(
	payload: TDecodedPayload,
	options: JwtOptions<jwt.SignOptions>
) => {
	const { secretKey, ...restOfOptions } = options;

	const encodedToken = jwt.sign(payload, secretKey, restOfOptions);

	return encodedToken;
};

export function generateAccessToken(this: HydratedUserType, options: jwt.SignOptions = {}) {
	const { expiresIn = ENVIRONMENT.ACCESS_JWT_EXPIRES_IN } = options;

	const payLoad = { id: this.id };

	const accessToken = encodeJwtToken(payLoad, { expiresIn, secretKey: ENVIRONMENT.ACCESS_SECRET });

	return accessToken;
}

export function generateRefreshToken(this: HydratedUserType, options: jwt.SignOptions = {}) {
	const { expiresIn = ENVIRONMENT.REFRESH_JWT_EXPIRES_IN } = options;

	const payLoad = { id: this.id };

	const refreshToken = encodeJwtToken(payLoad, { expiresIn, secretKey: ENVIRONMENT.REFRESH_SECRET });

	return refreshToken;
}

export const isTokenInWhitelist = (
	refreshTokenArray: UserType["refreshTokenArray"],
	zayneRefreshToken: string
) => {
	const whiteListSet = new Set(refreshTokenArray.map((token) => token));

	return whiteListSet.has(zayneRefreshToken);
};

export const warnAboutTokenReuse = (options: { compromisedToken: string; currentUser: UserType }) => {
	const { compromisedToken, currentUser } = options;

	const message = "Possible token reuse detected!";

	const user = pickKeys(currentUser, ["id", "email", "username", "role", "lastLogin", "loginRetries"]);

	consola.warn(message);
	consola.warn({
		compromisedToken,
		timestamp: new Date().toISOString(),
		user,
		userAgent: navigator.userAgent,
	});
	console.trace();
};

export const getUpdatedTokenArray = (
	currentUser: HydratedDocument<UserType>,
	zayneRefreshToken: string | undefined
): string[] => {
	if (!zayneRefreshToken) {
		return currentUser.refreshTokenArray;
	}

	// == If it turns out that the refreshToken is not in the whitelist array, the question is why would a user be signing in with a refreshToken that is not in the array?
	// == So it can be seen as a token reuse situation. Whether it's valid or not is of no concern rn.
	// == Is it a possible token reuse attack or not? E no concern me.
	// == Just log out the user from all other devices by removing all tokens from the array to avoid any possible issues

	if (!isTokenInWhitelist(currentUser.refreshTokenArray, zayneRefreshToken)) {
		warnAboutTokenReuse({ compromisedToken: zayneRefreshToken, currentUser });

		return [];
	}

	const updatedTokenArray = currentUser.refreshTokenArray.filter((token) => token !== zayneRefreshToken);

	return updatedTokenArray;
};
