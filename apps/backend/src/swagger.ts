import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup, type SwaggerOptions, type SwaggerUiOptions } from "swagger-ui-express";
import { ENVIRONMENT } from "./config/env";

const swaggerOptions: SwaggerOptions = {
	apis: ["./src/app/**/routes.ts"], // Point to your route files
	definition: {
		components: {},
		info: {
			description: "API documentation for Digital Genie e-commerce platform",
			title: "Digital Genie API Documentation",
			version: "1.0.0",
		},
		openapi: "3.0.0",
		servers: [
			{
				description: "Development server",
				url: ENVIRONMENT.BACKEND_URL,
			},
		],
	},
} satisfies SwaggerOptions;

// Initialize swagger-jsdoc with options
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions = {} satisfies SwaggerUiOptions;

const router = express.Router();

router.use(serve, setup(swaggerSpec, swaggerUiOptions));

export { router as swaggerRouter };
