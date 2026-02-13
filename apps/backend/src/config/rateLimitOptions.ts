import type { Options } from "express-rate-limit";

const rateLimitOptions = {
	max: 100, // Limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later.",
	standardHeaders: true,
	windowMs: 15 * 60 * 1000, // 15 minutes
} satisfies Partial<Options>;

export { rateLimitOptions };
