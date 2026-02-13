import { on } from "@zayne-labs/toolkit-core";
import { useThemeStore } from "./store/zustand/themeStore";

// NOTE - This prevents flicker of wrong theme onLoad
useThemeStore.getState().actions.initThemeOnLoad();

// NOTE - Preloader Removal
const removePreloader = () => {
	const preloaderElement = document.querySelector<HTMLElement>("#preloader");

	if (!preloaderElement) return;

	preloaderElement.style.opacity = "0";

	const cleanUpForTransitionEnd = on("transitionend", preloaderElement, () => {
		preloaderElement.remove();
		cleanUpForTransitionEnd();
	});
};

on("DOMContentLoaded", document, removePreloader, { once: true });
