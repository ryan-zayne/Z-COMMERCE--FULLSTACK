import { zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		ignores: ["apps/frontend/dist", "apps/frontend/.monicon"],
		node: {
			security: true,
		},
		react: true,
		tailwindcssBetter: {
			settings: { entryPoint: "apps/frontend/tailwind.css" },
		},
		tanstack: {
			query: true,
		},
		typescript: {
			tsconfigPath: ["packages/*/tsconfig.json", "apps/*/tsconfig.json"],
		},
	},
	{
		files: ["apps/backend/**/*.ts"],
		rules: { "node/no-process-env": "error" },
	}
).overrides({
	"zayne/node/security/recommended": {
		files: ["apps/backend/src/**/*.ts"],
	},
});
