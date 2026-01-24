import argon2 from "@node-rs/argon2";
import { consola } from "consola";
import jwt from "jsonwebtoken";
import type { CallbackWithoutResultAndOptionalError, HydratedDocument } from "mongoose";
import type { HydratedUserType, UserType } from "@/app/auth/types";
import { ENVIRONMENT } from "@/config/env";
import { sendEmail } from "@/services/email";
import { getDomainReferer } from "@/utils";

export type JwtOptions<TExtraOptions> = TExtraOptions & {
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

export const sendVerificationEmail = async (user: HydratedUserType) => {
	const payload = { id: user.id };

	const emailVerificationToken = encodeJwtToken(payload, {
		expiresIn: 20 * 60 * 1000, // 20 minutes
		secretKey: ENVIRONMENT.EMAIL_SECRET,
	});

	await sendEmail({
		data: {
			email: user.email,
			name: user.username,
			to: user.email,
			verificationLink: `${getDomainReferer()}/auth/verify-email/${emailVerificationToken}`,
		},
		type: "welcomeEmail",
	});
};

export async function hashPassword(this: HydratedUserType, next: CallbackWithoutResultAndOptionalError) {
	if (!this.isModified("password")) {
		next();
	}

	this.password = await argon2.hash(this.password, {
		memoryCost: 19456,
		outputLen: 32,
		parallelism: 1,
		timeCost: 2,
	});
}

export async function verifyPassword(this: HydratedUserType, plainPassword: string) {
	if (!this.password) {
		return false;
	}

	const isValidPassword = await argon2.verify(this.password, plainPassword);

	return isValidPassword;
}

export const isTokenInWhitelist = (refreshTokenArray: string[], zayneRefreshToken: string) => {
	const tokenSet = new Set(refreshTokenArray);

	return tokenSet.has(zayneRefreshToken);
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
	// == Just log out the user from all devices by removing all tokens from the array to avoid any possible wahala
	if (!isTokenInWhitelist(currentUser.refreshTokenArray, zayneRefreshToken)) {
		consola.warn("Possible token reuse detected!");
		consola.trace({ timestamp: new Date().toISOString(), userId: currentUser._id.toString() });

		return [];
	}

	const updatedTokenArray = currentUser.refreshTokenArray.filter((token) => token !== zayneRefreshToken);

	return updatedTokenArray;
};
