import {
	composeTwoEventHandlers,
	type InferProps,
	type PolymorphicProps,
} from "@zayne-labs/toolkit-react/utils";
import { Slot } from "@zayne-labs/ui-react/common/slot";
import { Button } from "@/components/ui/button";
import { cnMerge } from "@/lib/utils/cn";
import { IconBox, type MoniconIconBoxProps } from "../../common/IconBox";
import { Overlay as OverlayPrimitive } from "../../common/Overlay";
import { Teleport } from "../../primitives/teleport";
import { DrawerContextProvider, useDrawer, useDrawerContext } from "./drawer-context";
import type { DrawerCloseProps, DrawerContentProps, DrawerRootProviderProps } from "./types";

export function DrawerRootProvider(props: DrawerRootProviderProps) {
	const { children, value } = props;

	return (
		<DrawerContextProvider value={value}>
			<Teleport to="body > #portal-holder">
				<aside data-id="Drawer-Portal" className="isolate z-1000">
					{children}
				</aside>
			</Teleport>
		</DrawerContextProvider>
	);
}

export function DrawerRoot(props: Omit<InferProps<typeof DrawerRootProvider>, "value">) {
	const drawer = useDrawer();

	return <DrawerRootProvider value={drawer} {...props} />;
}

export function DrawerOverlay() {
	const { isOpen, onClose } = useDrawerContext();

	return <OverlayPrimitive className="z-10" isOpen={isOpen} onClose={onClose} />;
}

export function DrawerTrigger<TElement extends React.ElementType = "button">(
	props: PolymorphicProps<TElement, { as?: TElement; asChild?: boolean }>
) {
	const { as: Element = "button", asChild = false, children, ...restOfProps } = props;

	const { onToggle } = useDrawerContext();

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component {...restOfProps} onClick={composeTwoEventHandlers(onToggle, restOfProps.onClick)}>
			{children}
		</Component>
	);
}

export function DrawerContent({ children, className, placement = "right" }: DrawerContentProps) {
	const { isOpen } = useDrawerContext();

	const placementClasses = {
		left: "left-0 -translate-x-full",
		right: "right-0 translate-x-full",
	};

	return (
		<main
			data-id="Drawer Content Container"
			className={cnMerge(
				`fixed inset-y-0 z-50 flex custom-scrollbar flex-col overflow-y-auto bg-body
				transition-transform ease-slide-out`,

				placementClasses[placement],

				isOpen ? "translate-x-0 duration-600" : "duration-250 ease-slide-out",

				className
			)}
		>
			{children}
		</main>
	);
}

export function DrawerCloseButton(props: DrawerCloseProps & InferProps<"button">) {
	const { children, icon = "ri:close-fill", ...restOfProps } = props;

	const { onClose } = useDrawerContext();

	return (
		<Button
			unstyled={true}
			{...restOfProps}
			onClick={composeTwoEventHandlers(onClose, restOfProps.onClick)}
		>
			{children ?? <IconBox icon={icon as MoniconIconBoxProps["icon"]} />}
		</Button>
	);
}

export const Trigger = DrawerTrigger;

export const CloseButton = DrawerCloseButton;

export const Content = DrawerContent;

export const Overlay = DrawerOverlay;

export const Root = DrawerRoot;

export const RootProvider = DrawerRootProvider;
