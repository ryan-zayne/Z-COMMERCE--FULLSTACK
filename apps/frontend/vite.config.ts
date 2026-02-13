import { monicon } from "@monicon/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { icons } from "./src/components/icons/icon-constant";

export default defineConfig({
	plugins: [react(), tailwindcss(), viteTsconfigPaths(), monicon({ icons, typesFileName: "types" })],

	// server: {
	// 	proxy: {
	// 		"/api": {
	// 			changeOrigin: true,
	// 			target: "http://localhost:8000",
	// 		},
	// 	},
	// },
});
