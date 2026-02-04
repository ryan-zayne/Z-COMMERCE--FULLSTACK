import type { z } from "zod";
import { UserModel } from "@/app/auth/model";
import type { HydratedUserType } from "@/app/auth/types";
import { catchAsync } from "@/middleware";
import { AppError, AppResponse } from "@/utils";
import { sendVerificationEmail } from "../services/common";
import type { backendApiSchemaRoutes } from "../services/validation";

const resendVerificationEmail = catchAsync<{
	body: z.infer<(typeof backendApiSchemaRoutes)["@post/auth/resend-verification"]["body"]>;
}>(async (req, res) => {
	const { email } = req.body;

	const user = await UserModel.findOne({ email });

	if (!user) {
		throw new AppError({ code: 400, message: "No user found with provided email" });
	}

	if (user.isEmailVerified) {
		throw new AppError({ code: 400, message: "Email already verified" });
	}

	await sendVerificationEmail(user as HydratedUserType);

	return AppResponse(res, { data: null, message: `Verification link sent to ${email}` });
});

export { resendVerificationEmail };
