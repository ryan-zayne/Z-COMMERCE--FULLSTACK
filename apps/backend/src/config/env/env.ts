import { consola } from "consola";
import { z } from "zod";
import { envSchema } from "./schema";

// == Disabling process.env globally via TS
declare global {
	// eslint-disable-next-line ts-eslint/no-namespace
	namespace NodeJS {
		// interface ProcessEnv extends z.infer<typeof envSchema> {}

		// eslint-disable-next-line ts-eslint/consistent-type-definitions, ts-eslint/consistent-indexed-object-style
		interface ProcessEnv {
			[key: string]: undefined;
		}
	}
}

export const getBackendEnv = () => {
	// eslint-disable-next-line node/no-process-env
	const result = envSchema.safeParse(process.env);

	if (!result.success) {
		const missingKeys = Object.keys(z.flattenError(result.error).fieldErrors);

		const errorMessage = `Missing required environment variable(s):\n → ${missingKeys.join("\n → ")}`;

		const error = new Error(errorMessage, { cause: z.flattenError(result.error).fieldErrors });

		error.stack = "";

		consola.error(error);

		// eslint-disable-next-line node/no-process-exit, unicorn/no-process-exit
		process.exit(1);
	}

	return result.data;
};

export const ENVIRONMENT = getBackendEnv();
