import { isBrowser, pipeline } from "@zayne-labs/toolkit-core";
import { createReactStore } from "@zayne-labs/toolkit-react/zustand-compat";
import { defineEnum } from "@zayne-labs/toolkit-type-helpers";
import type { StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

const SYSTEM_THEMES = defineEnum(["light", "dark"], { inferredUnionVariant: "values" });
// NOTE - Add other themes here if needed
const EXPLICIT_THEMES = defineEnum([...SYSTEM_THEMES], { inferredUnionVariant: "values" });
const ALL_THEMES = defineEnum([...EXPLICIT_THEMES, "system"], { inferredUnionVariant: "values" });

type SystemThemeModes = typeof SYSTEM_THEMES.$inferUnion;
type ExplicitThemeModes = typeof EXPLICIT_THEMES.$inferUnion;
type ThemeModes = typeof ALL_THEMES.$inferUnion;

type ThemeStore = {
	actions: {
		getSsrThemeSyncScriptContent: () => string;
		initThemeOnLoad: () => void;
		setTheme: (newTheme: ThemeModes) => void;
		toggleLightAndDark: () => void;
	};
	resolvedTheme: ExplicitThemeModes;
	systemTheme: SystemThemeModes;
	theme: ThemeModes;
};

const getSystemThemeMq = () => {
	if (!isBrowser()) return;

	return globalThis.matchMedia("(prefers-color-scheme: dark)");
};

const getPrefersDarkMode = () => Boolean(getSystemThemeMq()?.matches);

const resolveTheme = (ctx: Pick<ThemeStore, "systemTheme" | "theme">): ExplicitThemeModes => {
	const { systemTheme, theme } = ctx;

	return theme === "system" ? systemTheme : theme;
};

const syncResolvedThemeWithDocument = (ctx: { resolvedTheme: ExplicitThemeModes }) => {
	const { resolvedTheme } = ctx;

	document.documentElement.dataset.theme = resolvedTheme;

	useThemeStore.setState({ resolvedTheme });
};

// Store Object Initialization
const themeStoreObjectFn: StateCreator<ThemeStore> = (set, get) => ({
	/* eslint-disable perfectionist/sort-objects -- Ignore sort here */

	theme: "system",

	systemTheme: getPrefersDarkMode() ? "dark" : "light",

	resolvedTheme: getPrefersDarkMode() ? "dark" : "light",

	actions: {
		/* eslint-enable perfectionist/sort-objects -- Ignore sort here */

		getSsrThemeSyncScriptContent: () => {
			const storageKey = useThemeStore.persist.getOptions().name;

			const script = /* js */ `
				try {
					const rawItem = localStorage.getItem(${JSON.stringify(storageKey)});

					const theme = rawItem ? JSON.parse(rawItem)?.state?.theme ?? "system" : "system";

					const validTheme = ${JSON.stringify(ALL_THEMES)}.includes(theme) ? theme : "system";

					const resolvedTheme =
						validTheme === "system"
							? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
							: validTheme;

					document.documentElement.dataset.theme = resolvedTheme;
				} catch {
					document.documentElement.dataset.theme = "light";
				}
			`;

			return script;
		},

		initThemeOnLoad: () => {
			if (!isBrowser()) return;

			const { systemTheme, theme } = get();

			const resolvedTheme = resolveTheme({ systemTheme, theme });

			syncResolvedThemeWithDocument({ resolvedTheme });

			getSystemThemeMq()?.addEventListener("change", (event) => {
				set({ systemTheme: event.matches ? "dark" : "light" });
			});
		},

		setTheme: (newTheme) => set({ theme: newTheme }),

		toggleLightAndDark: () => {
			const { actions, resolvedTheme } = get();

			actions.setTheme(resolvedTheme === "light" ? "dark" : "light");
		},
	},
});

export const useThemeStore = createReactStore(
	pipeline(
		themeStoreObjectFn,
		(store) => {
			return persist(store, {
				migrate: (persistedState) => persistedState,
				name: "colorScheme",
				partialize: ({ theme }) => ({ theme }),
				// skipHydration: true, // NOTE - Turn on in ssr context
				version: 1,
			});
		},
		(store) => devtools(store)
	)
);

useThemeStore.subscribe.withSelector(
	({ systemTheme, theme }) => resolveTheme({ systemTheme, theme }),
	(resolvedTheme) => {
		syncResolvedThemeWithDocument({ resolvedTheme });
	}
);
