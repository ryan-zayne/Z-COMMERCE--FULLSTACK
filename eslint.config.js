import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
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
	type: "app-strict",
	typescript: {
		tsconfigPath: ["packages/*/tsconfig.json", "apps/*/tsconfig.json"],
	},
}).overrides({
	"zayne/node/security/recommended": {
		files: ["apps/backend/src/**/*.ts"],
	},
});
