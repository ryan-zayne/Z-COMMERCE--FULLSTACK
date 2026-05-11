import { isBrowser } from "@zayne-labs/toolkit-core";
import { createReactStore } from "@zayne-labs/toolkit-react/zustand-compat";
import type { StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
	actions: {
		initThemeOnLoad: () => void;
		setTheme: (newTheme: "dark" | "light" | "system") => void;
		toggleTheme: () => void;
	};
	isDarkMode: boolean;

	systemTheme: "dark" | "light";

	theme: "dark" | "light" | "system";
};

const getPrefersDarkMode = () => {
	return isBrowser() && globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
};

const resolveTheme = (ctx: Pick<ThemeStore, "systemTheme" | "theme">) => {
	const { systemTheme, theme } = ctx;

	return theme === "system" ? systemTheme : theme;
};

// Store Object Initialization
const themeStoreObjectFn: StateCreator<ThemeStore> = (set, get) => ({
	/* eslint-disable perfectionist/sort-objects -- Ignore sort here */

	theme: "system",

	systemTheme: getPrefersDarkMode() ? "dark" : "light",

	isDarkMode: getPrefersDarkMode(),

	actions: {
		/* eslint-enable perfectionist/sort-objects -- Ignore sort here */

		getSSRThemeSyncScript: () => {
			const storageKey = useThemeStore.persist.getOptions().name;

			return /* js */ `
				try {
						const raw = localStorage.getItem(${JSON.stringify(storageKey)});
						const theme = raw ? JSON.parse(raw)?.state?.theme ?? "system" : "system";
						const valid = ["light", "dark", "system"].includes(theme) ? theme : "system";
						const resolved =
							valid === "system"
								? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
								: valid;
						document.documentElement.dataset.theme = resolved;
					} catch {
						document.documentElement.dataset.theme = "light";
					}
			`;
		},

		initThemeOnLoad: () => {
			if (!isBrowser()) return;

			const { systemTheme, theme } = get();

			document.documentElement.dataset.theme = resolveTheme({ systemTheme, theme });
		},

		setTheme: (newTheme) => {
			const { systemTheme } = get();

			const resolvedTheme = resolveTheme({ systemTheme, theme: newTheme });

			document.documentElement.dataset.theme = resolvedTheme;

			set({ theme: newTheme });
		},

		toggleTheme: () => {
			const { actions, systemTheme, theme } = get();

			const currentTheme = resolveTheme({ systemTheme, theme });

			actions.setTheme(currentTheme === "light" ? "dark" : "light");
		},
	},
});

// Store hook Creation
export const useThemeStore = createReactStore(
	persist(themeStoreObjectFn, {
		migrate: (persistedState) => persistedState,
		name: "colorScheme",
		partialize: ({ theme }) => ({ theme }),
		skipHydration: true, // ← you control rehydration timing
		version: 1,
	})
);

useThemeStore.subscribe.withSelector(
	(state) => state.theme,
	(theme) => {
		useThemeStore.setState({ isDarkMode: theme === "dark" });
	}
);
