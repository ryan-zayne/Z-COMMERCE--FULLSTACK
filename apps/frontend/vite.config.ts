import { clean } from "@monicon/core/plugins";
import { monicon } from "@monicon/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { iconsArray } from "./config/monicon/icon-constant";
import { iconFilePlugin } from "./config/monicon/iconFilePlugin";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		viteTsconfigPaths(),
		monicon({
			icons: iconsArray,
			plugins: [clean({ patterns: [".monicon"] }), iconFilePlugin({ outputPath: ".monicon" })],

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
