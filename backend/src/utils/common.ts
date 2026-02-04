import { omitKeys } from "@zayne-labs/toolkit-core";
import type { UnmaskType } from "@zayne-labs/toolkit-type-helpers";
import type { CookieOptions, Response } from "express";
import type { AnyObject } from "mongoose";
import type { HydratedUserType, UserType } from "@/app/auth/types";
import { ENVIRONMENT } from "../config/env";

type PossibleCookieNames = UnmaskType<"zayneAccessToken" | "zayneRefreshToken">;

export const setCookie = (
	res: Response,
	name: PossibleCookieNames,
	value: number | string,
	options: CookieOptions = {}
) => {
	const isProduction = ENVIRONMENT.NODE_ENV === "production";

	res.cookie(name, value, {
		httpOnly: true,
		partitioned: isProduction,
		sameSite: isProduction ? "none" : "lax",
		secure: isProduction,
		signed: true,
		...options,
	});
};

export const removeCookie = (res: Response, name: PossibleCookieNames) => {
	res.cookie(name, "expired", { maxAge: -1 });
};

export const omitSensitiveFields = <TObject extends AnyObject, TOmitArray extends Array<keyof UserType>>(
	userObject: TObject,
	keysToOmit?: TOmitArray | null,
	options?: { replaceId?: boolean }
) => {
	const { replaceId } = options ?? {};

	// == Use JSON.parse and JSON.stringify to clone the user object, to prevent `omitKeys` from transforming the object to mongodb nonsense
	// eslint-disable-next-line unicorn/prefer-structured-clone
	const clonedUserObject = JSON.parse(JSON.stringify(userObject)) as HydratedUserType;

	if (replaceId) {
		clonedUserObject.id = clonedUserObject._id as unknown as string;
	}

	const safeUserObject = omitKeys(clonedUserObject, [
		"_id",
		"updatedAt",
		"createdAt",
		"lastLogin",
		"refreshTokenArray",
		"loginRetries",
		"password",
		"__v",
		...(keysToOmit ?? []),
	]);

	return safeUserObject;
};

export const getDomainReferer = () => {
	return ENVIRONMENT.NODE_ENV === "development" ? "http://localhost:5173" : ENVIRONMENT.FRONTEND_URL;
};

// prettier-ignore
/**
 * @description
 * - This function is used to evaluate a string as js and return the result
 * - It uses globalThis.eval to to achieve indirect eval {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#indirect_eval|(see article)}
 * @param value
 * @returns The result of the evaluation
 */
export const evaluateString = <TResult>(value: string) => globalThis.eval(`"use strict";(${value})`) as TResult;
