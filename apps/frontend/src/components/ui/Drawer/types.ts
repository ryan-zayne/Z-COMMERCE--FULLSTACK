import type { useDisclosure } from "@zayne-labs/toolkit-react";

// Drawer store types
export type DrawerContext = ReturnType<typeof useDisclosure>;

export type DrawerRootProviderProps = { children: React.ReactNode; value: DrawerContext };

export type DrawerContentProps = Pick<DrawerRootProviderProps, "children"> & {
	className?: string;
	placement?: "left" | "right";
};

export type DrawerCloseProps = Pick<DrawerContentProps, "className"> & { icon?: string };
