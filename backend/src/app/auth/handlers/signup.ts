import type { z } from "zod";
import { UserModel } from "@/app/auth/model";
import type { HydratedUserType } from "@/app/auth/types";
import { ENVIRONMENT } from "@/config/env";
import { catchAsync } from "@/middleware";
import { AppError, AppResponse, omitSensitiveFields, setCookie } from "@/utils";
import { sendVerificationEmail } from "../services/common";
import type { SignupBodySchema } from "../services/validation";

const signUp = catchAsync<{
	body: z.infer<typeof SignupBodySchema>;
}>(async (req, res) => {
	const { email, password, username } = req.body;

	const existingUser = Boolean(await UserModel.exists({ email }));

	if (existingUser) {
		throw new AppError({ code: 400, message: "User with this email already exists!" });
	}

	const newUser = await UserModel.create({ email, password, username });

	const newZayneRefreshToken = newUser.generateRefreshToken();

	await UserModel.updateOne({ id: newUser.id }, { refreshTokenArray: [newZayneRefreshToken] });

	const newZayneAccessToken = newUser.generateAccessToken();

	setCookie(res, "zayneAccessToken", newZayneAccessToken, {
		expires: new Date(Date.now() + ENVIRONMENT.ACCESS_JWT_EXPIRES_IN),
	});

	setCookie(res, "zayneRefreshToken", newZayneRefreshToken, {
		expires: new Date(Date.now() + ENVIRONMENT.REFRESH_JWT_EXPIRES_IN),
	});

	void sendVerificationEmail(newUser as HydratedUserType);

	return AppResponse(res, {
		data: {
			user: omitSensitiveFields(newUser, ["isDeleted"], { replaceId: true }),
		},
		message: "Account created successfully",
	});
});

export { signUp };
