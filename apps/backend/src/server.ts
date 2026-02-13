import "@colors/colors";
import { consola } from "consola";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { authRouter } from "./app/auth/routes";
import { paymentRouter } from "./app/payment/routes";
import { corsOptions, helmetOptions, rateLimitOptions, setConnectionToDb } from "./config";
import { ENVIRONMENT } from "./config/env";
import { errorHandler, notFoundHandler, validateWithZodGlobal } from "./middleware";
import { swaggerRouter } from "./swagger";

const app = express();

/**
 *  == Express configuration
 */
// app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]); // Enable trust proxy
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(ENVIRONMENT.COOKIE_SECRET));

/**
 *  == Middleware - App Security
 */
app.use(helmet(helmetOptions));
app.use(cors(corsOptions)); // Cors
app.use(rateLimit(rateLimitOptions)); // Rate Limiting
// app.use(mongoSanitize({ replaceWith: "_" })); // Data sanitization against NoSQL query injection - Incompatible with express v5
app.use(hpp()); // Prevent Parameter Pollution
app.use((_req, res, next) => {
	// Prevent browser from caching sensitive information
	res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
	res.set("Pragma", "no-cache");
	res.set("Expires", "0");
	next();
});

/**
 *  == Middleware - Logger
 *  FIXME: Add winston later following guide for logging in brave tabs
 */
app.use(morgan("dev"));

app.use("/api/docs", swaggerRouter);

app.get("/", (_req, res) => res.json({ message: "Server is up and running", status: "success" }));

// Global request body validator
app.use("/api/v1/*splat", validateWithZodGlobal);

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/payment", paymentRouter);

/**
 *  == Route 404 handler
 */
app.all("*splat", notFoundHandler);

/**
 *  == Central error handler
 */
app.use(errorHandler);

/**
 *  == UncaughtException handler
 */
process.on("uncaughtException", (error) => {
	consola.error(new Error("UNCAUGHT EXCEPTION! 💥 Server Shutting down...", { cause: error }));

	consola.info({
		date: new Date().toLocaleString("en-Nigeria", {
			dateStyle: "full",
			timeStyle: "medium",
			timeZone: "Africa/Lagos",
		}),
	});

	// eslint-disable-next-line node/no-process-exit
	process.exit(1);
});

/**
 *  == Connect to DataBase and Listen for server
 */
app.listen(ENVIRONMENT.PORT, () => {
	void setConnectionToDb();
	console.info(`Server listening at http://localhost:${ENVIRONMENT.PORT}`.yellow.italic);
});
