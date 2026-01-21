import type { HydratedDocument } from "mongoose";
import { UserModel } from "@/app/auth/model";
import type { UserType } from "@/app/auth/types";
import { catchAsync } from "@/middleware";
import { AppResponse, removeCookie } from "@/utils";
import { getUpdatedTokenArray } from "../services/common";

// @route GET /api/auth/signout
// @access Private
const signOut = catchAsync<{ user: HydratedDocument<UserType> }>(async (req, res) => {
	const currentUser = req.user;
	const { zayneRefreshToken } = req.signedCookies;

	const updatedTokenArray = getUpdatedTokenArray(currentUser, zayneRefreshToken);

	await UserModel.findByIdAndUpdate(currentUser.id, { refreshTokenArray: updatedTokenArray });

	removeCookie(res, "zayneAccessToken");
	removeCookie(res, "zayneRefreshToken");

	return AppResponse(res, 200, "Signed out successfully");
});

export { signOut };
