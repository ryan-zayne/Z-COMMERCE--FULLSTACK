// import { clean } from "@monicon/core/plugins";
import { monicon } from "@monicon/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { iconsArray } from "./config/monicon/iconsArray";
import { iconsGenPlugin } from "./config/monicon/iconsGenPlugin";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		viteTsconfigPaths(),
		monicon({
			icons: iconsArray,
			plugins: [
				// clean({ patterns: [".monicon"] }),
				iconsGenPlugin({ outputPath: ".monicon" }),
			],

			watch: false,
		}),
	],

	// server: {
	// 	proxy: {
	// 		"/api": {
	// 			changeOrigin: true,
	// 			target: "http://localhost:8000",
	// 		},
	// 	},
	// },
});
