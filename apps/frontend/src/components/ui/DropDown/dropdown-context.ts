import { createCustomContext, useDisclosure } from "@zayne-labs/toolkit-react";

export type DropdownContext = ReturnType<typeof useDisclosure>;

export const [DropdownContextProvider, useDropdownContext] = createCustomContext<DropdownContext>({
	hookName: "useDropdownContext",
	name: "DropdownContext",
	providerName: "DropdownContextProvider",
});

export const useDropdown = (options?: Parameters<typeof useDisclosure>[0]) => useDisclosure(options);
