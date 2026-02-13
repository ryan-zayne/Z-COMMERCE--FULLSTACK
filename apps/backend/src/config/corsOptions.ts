import type { CorsOptions } from "cors";

const corsOptions = {
	credentials: true,
	optionsSuccessStatus: 200,
	origin: [
		"http://localhost:5173",
		"https://digital-genie.vercel.app",
		"https://digital-genie.netlify.app",
	],
} satisfies CorsOptions;

export { corsOptions };
