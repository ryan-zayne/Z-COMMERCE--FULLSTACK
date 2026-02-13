/* eslint-disable ts-eslint/consistent-type-definitions */
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly NODE_ENV: "development" | "production";
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
