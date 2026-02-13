import { z } from "zod";
import { evaluateString } from "@/utils";

export const envSchema = z.object({
	ACCESS_JWT_EXPIRES_IN: z.string().transform((value) => evaluateString<number>(value)),
	ACCESS_SECRET: z.string(),
	BACKEND_URL: z.string().default("http://localhost:8000"),
	COOKIE_SECRET: z.string(),
	EMAIL_APP_PASSWORD: z.string(),
	EMAIL_SECRET: z.string(),
	EMAIL_USER: z.string(),
	FRONTEND_URL: z.string(),
	MONGO_URI: z.string(),
	NODE_ENV: z.enum(["development", "production"]),
	PAYSTACK_HOST: z.string(),
	PAYSTACK_SECRET_KEY: z.string(),
	PORT: z.coerce.number().default(8000),
	REFRESH_JWT_EXPIRES_IN: z.string().transform((value) => evaluateString<number>(value)),
	REFRESH_SECRET: z.string(),
});
