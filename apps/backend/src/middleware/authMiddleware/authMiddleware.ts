import type { HydratedDocument } from "mongoose";
import type { UserType } from "@/app/auth/types";
import { ENVIRONMENT } from "@/config/env";
import { setCookie } from "@/utils";
import { catchAsync } from "../catchAsyncErrors";
import { validateUserSession } from "./validateUserSession";

const authMiddleware = catchAsync<{ user: HydratedDocument<UserType> }>(async (req, res, next) => {
	const { zayneAccessToken, zayneRefreshToken } = req.signedCookies;

	const { currentUser, newZayneAccessTokenResult } = await validateUserSession({
		zayneAccessToken,
		zayneRefreshToken,
	});

	if (newZayneAccessTokenResult) {
		setCookie(res, "zayneAccessToken", newZayneAccessTokenResult, {
			expires: new Date(Date.now() + ENVIRONMENT.ACCESS_JWT_EXPIRES_IN),
		});
	}

	req.user = currentUser;

	next();
});

export { authMiddleware };
