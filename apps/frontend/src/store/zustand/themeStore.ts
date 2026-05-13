import { isBrowser, on, pipeline } from "@zayne-labs/toolkit-core";
import { createReactStore } from "@zayne-labs/toolkit-react/zustand-compat";
import { defineEnum } from "@zayne-labs/toolkit-type-helpers";
import type { StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

const SYSTEM_THEMES = defineEnum(["light", "dark"], { inferredUnionVariant: "values" });
const EXPLICIT_THEMES = defineEnum([...SYSTEM_THEMES], { inferredUnionVariant: "values" });

type SystemThemeModes = typeof SYSTEM_THEMES.$inferUnion;
export type ExplicitThemeModes = typeof EXPLICIT_THEMES.$inferUnion;
export type ThemeModes = "system" | ExplicitThemeModes;

type ThemeStore = {
	actions: {
		getSsrThemeSyncScriptContent: () => string;
		initThemeOnLoad: () => (() => void) | undefined;
		setTheme: (newTheme: ThemeModes) => void;
		toggleLightAndDark: () => void;
	};
	theme: ExplicitThemeModes;
	userThemeIntent: ThemeModes;
};

const getSystemThemeMq = () => {
	if (!isBrowser()) return;
	return globalThis.matchMedia("(prefers-color-scheme: dark)");
};

const getSystemTheme = (): SystemThemeModes => (getSystemThemeMq()?.matches ? "dark" : "light");

const themeStoreObjectFn: StateCreator<ThemeStore> = (set, get) => ({
	theme: getSystemTheme(),

	userThemeIntent: "system",

	/* eslint-disable perfectionist/sort-objects */
	actions: {
		/* eslint-enable perfectionist/sort-objects */

		getSsrThemeSyncScriptContent: () => {
			const storageKey = useThemeStore.persist.getOptions().name;

			const script = /* js */ `
				try {
					const rawItem = localStorage.getItem(${JSON.stringify(storageKey)});
					const parsed = rawItem ? JSON.parse(rawItem)?.state : null;

					const intent = parsed?.userThemeIntent;

					const theme = !intent || intent === "system"
						? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
						: ${JSON.stringify(EXPLICIT_THEMES)}.includes(intent) ? intent : "light";

					document.documentElement.dataset.theme = theme;
				} catch {
					document.documentElement.dataset.theme = "light";
				}
			`;

			return script;
		},

		initThemeOnLoad: () => {
			if (!isBrowser()) return;

			const mq = getSystemThemeMq();

			if (!mq) return;

			const cleanup = on(mq, "change", (event) => {
				const { userThemeIntent } = get();

				if (userThemeIntent !== "system") return;

				set({ theme: event.matches ? "dark" : "light" });
			});

			return cleanup;
		},

		setTheme: (newTheme) => {
			if (newTheme === "system") {
				set({ theme: getSystemTheme(), userThemeIntent: "system" });
				return;
			}

			set({ theme: newTheme, userThemeIntent: newTheme });
		},

		toggleLightAndDark: () => {
			const { actions, theme } = get();
			actions.setTheme(theme === "light" ? "dark" : "light");
		},
	},
});

export const useThemeStore = createReactStore(
	pipeline(
		themeStoreObjectFn,
		(store) =>
			persist(store, {
				name: "colorScheme",
				partialize: ({ theme, userThemeIntent }) => ({ theme, userThemeIntent }),
				// skipHydration: true, // NOTE - Turn on in SSR context
				version: 1,
			}),
		(store) => devtools(store)
	)
);

useThemeStore.subscribe.withSelector(
	(state) => state.theme,
	(theme) => {
		if (!isBrowser()) return;

		document.documentElement.dataset.theme = theme;
	},
	{ fireListenerImmediately: true }
);
