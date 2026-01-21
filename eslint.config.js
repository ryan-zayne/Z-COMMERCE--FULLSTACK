import { zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		ignores: ["frontend/dist", "frontend/.monicon"],
		node: {
			security: true,
		},
		react: true,
		tailwindcssBetter: {
			settings: { entryPoint: "frontend/tailwind.css" },
		},
		tanstack: {
			query: true,
		},
		typescript: {
			tsconfigPath: ["**/tsconfig.json"],
		},
	},
	{
		files: ["backend/src/**/*.ts"],
		rules: {
			"import/default": "off",
			"import/no-named-as-default-member": "off",
			"node/no-process-env": "error",
		},
	}
).overrides({
	"zayne/node/security/recommended": {
		files: ["backend/src/**/*.ts"],
	},
});
