import type { SignOptions } from "jsonwebtoken";
import type { HydratedDocumentFromSchema, Model, Schema } from "mongoose";
import type { RolesEnum } from "@/constants/enums";

export type UserType = {
	address: string[];
	createdAt: Date;
	email: string;
	emailVerificationToken: string;
	ipAddress: string;
	isDeleted: boolean;
	isEmailVerified: boolean;
	isSuspended: boolean;
	lastLogin: number;
	loginRetries: number;
	password: string;
	passwordChangedAt: Date;
	passwordResetExpires: Date;
	passwordResetRetries: number;
	passwordResetToken: string;
	phoneNumber: string;
	refreshTokenArray: string[];
	role: keyof typeof RolesEnum;
	updatedAt: Date;
	username: string;
};

export type HydratedUserType = Omit<
	HydratedDocumentFromSchema<Schema<UserType, unknown, UserMethods>>,
	"id"
> & { id: string };

export type UserMethods = {
	generateAccessToken: (options?: SignOptions) => string;
	generateRefreshToken: (options?: SignOptions) => string;
	verifyPassword: (enteredPassword: string | undefined) => Promise<boolean>;
};

export type UserModelType = Model<UserType, unknown, UserMethods>;
