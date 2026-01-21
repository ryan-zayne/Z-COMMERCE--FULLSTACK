import { isBrowser } from "@zayne-labs/toolkit-core";
import { createReactStore } from "@zayne-labs/toolkit-react/zustand-compat";
import type { StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
	actions: {
		initThemeOnLoad: () => void;
		setTheme: (newTheme: "dark" | "light") => void;
		toggleTheme: () => void;
	};
	isDarkMode: boolean;

	systemTheme: "dark" | "light";

	theme: "dark" | "light" | "system";
};

const getPrefersDarkMode = () => {
	return isBrowser() && globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Store Object Initialization
const themeStoreObjectFn: StateCreator<ThemeStore> = (set, get) => ({
	/* eslint-disable perfectionist/sort-objects -- Ignore sort here */

	theme: "system",

	systemTheme: getPrefersDarkMode() ? "dark" : "light",

	isDarkMode: getPrefersDarkMode(),

	actions: {
		/* eslint-enable perfectionist/sort-objects -- Ignore sort here */

		initThemeOnLoad: () => {
			const { systemTheme, theme: persistedTheme } = get();

			isBrowser()
				&& (document.documentElement.dataset.theme =
					persistedTheme === "system" ? systemTheme : persistedTheme);
		},

		setTheme: (newTheme: "dark" | "light") => {
			document.documentElement.dataset.theme = newTheme;

			set({ isDarkMode: newTheme === "dark", theme: newTheme });
		},

		toggleTheme: () => {
			const { actions, systemTheme, theme: persistedTheme } = get();

			const currentTheme = persistedTheme === "system" ? systemTheme : persistedTheme;

			const newTheme = currentTheme === "light" ? "dark" : "light";

			actions.setTheme(newTheme);
		},
	},
});

// Store hook Creation
export const useThemeStore = createReactStore(
	persist(themeStoreObjectFn, {
		migrate: (persistedState) => persistedState,

		name: "colorScheme",

		partialize: ({ isDarkMode, theme }) => ({ isDarkMode, theme }),
		version: 1,
	})
);
