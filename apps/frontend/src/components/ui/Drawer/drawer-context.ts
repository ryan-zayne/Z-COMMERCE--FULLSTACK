import { createCustomContext, useDisclosure } from "@zayne-labs/toolkit-react";
import type { DrawerContext } from "./types";

export const [DrawerContextProvider, useDrawerContext] = createCustomContext<DrawerContext>({
	hookName: "useDrawerContext",
	name: "DrawerContext",
	providerName: "DrawerContextProvider",
});

export const useDrawer = () => useDisclosure({ hasScrollControl: true });
