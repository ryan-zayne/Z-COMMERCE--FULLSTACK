import { monicon } from "@monicon/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { iconsArray } from "./monicon-config/iconsArray";
import { iconsGenPlugin } from "./monicon-config/iconsGenPlugin";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		monicon({
			icons: iconsArray,
			plugins: [iconsGenPlugin({ outputPath: ".monicon" })],
		}),
	],
});
