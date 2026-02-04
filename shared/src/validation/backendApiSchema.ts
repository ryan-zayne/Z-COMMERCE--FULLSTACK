import type { InferAllMainRouteKeys, InferAllMainRoutes } from "@zayne-labs/callapi";
import { fallBackRouteSchemaKey } from "@zayne-labs/callapi/constants";
import { defineSchema, defineSchemaRoutes } from "@zayne-labs/callapi/utils";
import { defineEnum } from "@zayne-labs/toolkit-type-helpers";
import { z } from "zod";

const BaseSuccessResponseSchema = z.object({
	data: z.record(z.string(), z.unknown()),
	message: z.string(),
	status: z.literal("success"),
});

const BaseErrorResponseSchema = z.object({
	errors: z.record(z.string(), z.array(z.string())).optional(),
	message: z.string(),
	status: z.literal("error"),
});

export type BaseApiSuccessResponse<TData = z.infer<typeof BaseSuccessResponseSchema.shape.data>> = Omit<
	z.infer<typeof BaseSuccessResponseSchema>,
	"data"
> & {
	data: TData;
};

export type BaseApiErrorResponse<TErrors = z.infer<typeof BaseErrorResponseSchema>["errors"]> = Omit<
	z.infer<typeof BaseErrorResponseSchema>,
	"errors"
> & {
	errors: TErrors;
};

const withBaseSuccessResponse = <TSchemaObject extends z.ZodType>(dataSchema: TSchemaObject) => {
	return BaseSuccessResponseSchema.extend({
		data: dataSchema,
	});
};

const withBaseErrorResponse = <
	TSchemaObject extends z.ZodType = typeof BaseErrorResponseSchema.shape.errors,
>(
	errorSchema?: TSchemaObject
) => {
	return BaseErrorResponseSchema.extend({
		errors: (errorSchema ?? BaseErrorResponseSchema.shape.errors) as NonNullable<TSchemaObject>,
	});
};

const defaultSchemaRoute = defineSchemaRoutes({
	[fallBackRouteSchemaKey]: {
		errorData: withBaseErrorResponse(),
	},
});

export const SignupBodySchema = z
	.object({
		acceptTerms: z.boolean().refine((val) => val, { error: "Please accept the terms and conditions" }),
		confirmPassword: z.string().min(1, { error: "Password confirmation is required!" }),
		email: z.email({ error: "Please enter a valid email!" }),
		password: z.string().min(8, { error: "Password must be at least 8 characters!" }),
		username: z
			.string()
			.min(3, { error: "Username must be at least 3 characters!" })
			.max(30, { error: "Username must not be more than 30 characters long" })
			.regex(/^(?!.*-[a-z])[A-Z]['a-z-]*(?:-[A-Z]['a-z-]*)*(?:'[A-Z]['a-z-]*)*$/, {
				error: `Username must be in sentence case, and can include hyphen, and apostrophes.
				A hyphen MUST be followed by an uppercase letter.
				Examples include: "Ali", "Ade-Bright" or "Smith's".`,
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords do not match!",
		path: ["confirmPassword"],
	});

export const SigninBodySchema = z.object({
	email: z.string().min(1, { error: "Email is a required field" }),
	password: z.string().min(1, { error: "Password is a required field" }),
	rememberMe: z.boolean().optional(),
});

const authRoutes = () => {
	const UserDataSchema = z.object({
		email: z.string(),
		id: z.string(),
		isEmailVerified: z.boolean(),
		isSuspended: z.boolean(),
		role: z.string(),
		username: z.string(),
	});

	return defineSchemaRoutes({
		"@get/auth/session": {
			data: withBaseSuccessResponse(
				z.object({
					user: UserDataSchema,
				})
			),
		},

		"@get/auth/signout": {
			data: withBaseSuccessResponse(z.null()),
		},

		"@post/auth/resend-verification": {
			body: z.object({
				email: z.email("Invalid email").min(1, "Email is required"),
			}),
			data: withBaseSuccessResponse(z.null()),
		},

		"@post/auth/signin": {
			body: SigninBodySchema,
			data: withBaseSuccessResponse(
				z.object({
					user: UserDataSchema,
				})
			),
		},

		"@post/auth/signup": {
			body: SignupBodySchema,
			data: withBaseSuccessResponse(
				z.object({
					user: UserDataSchema,
				})
			),
		},

		"@post/auth/verify-email": {
			data: withBaseSuccessResponse(z.null()),
		},
	});
};

export const InitializePaymentBodySchema = z.object({
	amount: z.number().positive("Amount must be positive"),
	cartItems: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			price: z.number().positive("Price must be positive"),
			quantity: z.int().positive("Quantity must be a positive integer"),
		})
	),
	customerEmail: z.email(),
	customerId: z.string(),
	redirectURL: z.url({ error: "Invalid redirect URL" }).optional(),
});

export const PaymentStatusEnum = defineEnum({
	FAILED: "FAILED",
	PAID: "PAID",
	"REFUND-FAILED": "REFUND-FAILED",
	REFUNDED: "REFUNDED",
	UNPAID: "UNPAID",
});

export const PaymentDetailsSchema = z.object({
	amount: z.number(),
	cartItems: InitializePaymentBodySchema.shape.cartItems,
	customerId: z.string(),
	id: z.string(),
	paymentDate: z.preprocess((value: string) => new Date(value), z.date()),
	paymentMeta: z.record(z.string(), z.unknown()),
	paymentStatus: z.enum(PaymentStatusEnum),
	reference: z.string(),
});

export const VerifyPaymentSchema = z.object({
	reference: z.string(),
});

const paymentRoutes = () => {
	return defineSchemaRoutes({
		"@post/payment/paystack/initialize": {
			body: InitializePaymentBodySchema,
			data: withBaseSuccessResponse(
				z.object({
					paymentDetails: PaymentDetailsSchema,
					paymentUrl: z.url(),
				})
			),
		},

		"@post/payment/paystack/verify": {
			body: VerifyPaymentSchema,
			data: withBaseSuccessResponse(z.null()),
		},
	});
};

export const backendApiSchema = defineSchema(
	{
		...defaultSchemaRoute,
		...authRoutes(),
		...paymentRoutes(),
	},
	{ strict: true }
);

export const backendApiSchemaRoutes = backendApiSchema.routes;

export type BackendApiRoutes = InferAllMainRoutes<typeof backendApiSchema.routes>;

export type BackendApiRouteKeys = InferAllMainRouteKeys<
	typeof backendApiSchema.routes,
	typeof backendApiSchema.config
>;
