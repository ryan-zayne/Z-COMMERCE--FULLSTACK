import { UserModel } from "@/app/auth/model";
import { ENVIRONMENT } from "@/config/env";
import { catchAsync } from "@/middleware";
import { AppError, AppResponse } from "@/utils";
import { decodeJwtToken } from "../services/common";

const verifyEmail = catchAsync<{ body: { token: string } }>(async (req, res) => {
	const { token } = req.body;

	if (!token) {
		throw new AppError({ code: 422, message: "Token is required" });
	}

	const decodedEmailVerificationToken = decodeJwtToken(token, { secretKey: ENVIRONMENT.EMAIL_SECRET });

	if (!decodedEmailVerificationToken.id) {
		throw new AppError({ code: 400, message: "Invalid verification token" });
	}

	const updatedUser = await UserModel.findByIdAndUpdate(
		decodedEmailVerificationToken.id,
		{ isEmailVerified: true },
		{ new: true }
	);

	if (!updatedUser) {
		throw new AppError({ code: 400, message: "Verification failed!" });
	}

	return AppResponse(res, {
		data: null,
		message: "Account successfully verified!",
	});
});

export { verifyEmail };
