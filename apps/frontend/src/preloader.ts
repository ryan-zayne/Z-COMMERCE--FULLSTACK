import { on } from "@zayne-labs/toolkit-core";
import { useThemeStore } from "./store/zustand/themeStore";

// NOTE - This prevents flicker of wrong theme onLoad
useThemeStore.getState().actions.initThemeOnLoad();

const removePreloader = () => {
	const preloaderElement = document.querySelector("#preloader");

	if (!preloaderElement) return;

	preloaderElement.classList.add("hidden");

	on(preloaderElement, "transitionend", () => preloaderElement.remove(), { once: true });
};

on(document, "app:ready" as never, removePreloader, { once: true });
