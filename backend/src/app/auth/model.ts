import mongoose from "mongoose";
import {
	generateAccessToken,
	generateRefreshToken,
	hashPassword,
	verifyPassword,
} from "@/app/auth/services/common";
import { RolesEnum } from "@/constants/enums";
import type { UserMethods, UserModelType, UserType } from "./types";

const UserSchema = new mongoose.Schema<UserType, unknown, UserMethods>(
	{
		email: {
			lowercase: true,
			required: [true, "Please add the user email address"],
			trim: true,
			type: String,
			unique: true,
		},
		emailVerificationToken: {
			select: false,
			type: String,
		},

		isDeleted: {
			default: false,
			select: false,
			type: Boolean,
		},

		isEmailVerified: {
			default: false,
			type: Boolean,
		},

		isSuspended: {
			default: false,
			type: Boolean,
		},

		lastLogin: {
			default: Date.now(),
			type: Number,
		},

		loginRetries: {
			default: 0,
			select: false,
			type: Number,
		},

		password: {
			min: [8, "Password must be at least 8 characters long"],
			required: [true, "Password field is required"],
			select: false,
			type: String,
		},

		refreshTokenArray: {
			default: [],
			select: false,
			type: [String],
		},

		role: {
			default: RolesEnum.member,
			enum: Object.values(RolesEnum),
			type: String,
		},

		username: {
			required: [true, "Please add the user name"],
			type: String,
		},
	},

	{ timestamps: true, versionKey: false }
);

UserSchema.pre("save", hashPassword);

UserSchema.method("verifyPassword", verifyPassword);
UserSchema.method("generateAccessToken", generateAccessToken);
UserSchema.method("generateRefreshToken", generateRefreshToken);

const UserModel =
	(mongoose.models.User as UserModelType | undefined)
	?? mongoose.model<UserType, UserModelType>("User", UserSchema);

export { UserModel };
