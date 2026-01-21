import { differenceInHours } from "date-fns";
import { UserModel } from "@/app/auth/model";
import type { HydratedUserType } from "@/app/auth/types";
import { ENVIRONMENT } from "@/config/env";
import { catchAsync } from "@/middleware";
import { AppError, AppResponse, omitSensitiveFields, setCookie } from "@/utils";
import { getUpdatedTokenArray, sendVerificationEmail } from "../services/common";
import type { SigninBodySchemaType } from "../services/validation";

// @route POST /api/auth/login
// @access Public
const signIn = catchAsync<{
	body: SigninBodySchemaType;
	signedCookies: {
		zayneRefreshToken: string;
	};
}>(async (req, res) => {
	const { zayneRefreshToken } = req.signedCookies;

	const { email, password } = req.body;

	const currentUser = await UserModel.findOne({ email }).select(["+password", "+refreshTokenArray"]);

	if (!currentUser) {
		throw new AppError(401, "Email or password is incorrect");
	}

	const isValidPassword = await currentUser.verifyPassword(password);

	if (!isValidPassword) {
		// == For every time the password is gotten wrong, increment the login retries by 1
		await UserModel.findByIdAndUpdate(currentUser._id, { $inc: { loginRetries: 1 } });

		throw new AppError(401, "Email or password is incorrect");
	}

	if (!currentUser.isEmailVerified) {
		// FIXME when using queues later change void to await
		void sendVerificationEmail(currentUser as HydratedUserType);
	}

	if (currentUser.isSuspended) {
		throw new AppError(401, "Your account is currently suspended");
	}

	// == Check if user has exceeded login retries (3 times in 12 hours)
	const now = new Date();

	const hoursSinceLastLogin = differenceInHours(now, currentUser.lastLogin);

	if (currentUser.loginRetries >= 3 && hoursSinceLastLogin < 12) {
		throw new AppError(401, "Login retries exceeded");

		// TODO: send reset password email to user
	}

	const newZayneRefreshToken = currentUser.generateRefreshToken();

	const updatedTokenArray = getUpdatedTokenArray(currentUser, zayneRefreshToken);

	const updatedUser = await UserModel.findByIdAndUpdate(
		currentUser.id,
		{
			// == Update user loginRetries to 0 and lastLogin to current time
			loginRetries: 0,
			// eslint-disable-next-line perfectionist/sort-objects
			lastLogin: Date.now(),
			refreshTokenArray: [...updatedTokenArray, newZayneRefreshToken],
		},
		{ new: true }
	);

	const newZayneAccessToken = currentUser.generateAccessToken();

	setCookie(res, "zayneAccessToken", newZayneAccessToken, {
		expires: new Date(Date.now() + ENVIRONMENT.ACCESS_JWT_EXPIRES_IN),
	});

	setCookie(res, "zayneRefreshToken", newZayneRefreshToken, {
		expires: new Date(Date.now() + ENVIRONMENT.REFRESH_JWT_EXPIRES_IN),
	});

	return AppResponse(res, 200, "Signed in successfully", {
		user: omitSensitiveFields(updatedUser, ["isDeleted"], { replaceId: true }),
	});
});

export { signIn };
