import { icons } from "@/components/icons/icon-constant";
import { monicon } from "@monicon/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";


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
