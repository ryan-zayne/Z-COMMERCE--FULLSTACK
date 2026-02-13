import {
	composeTwoEventHandlers,
	type DiscriminatedRenderProps,
	type InferProps,
	type PolymorphicProps,
} from "@zayne-labs/toolkit-react/utils";
import { Slot } from "@/components/primitives/slot";
import { cnMerge } from "@/lib/utils/cn";
import {
	DropdownContextProvider,
	useDropdown,
	useDropdownContext,
	type DropdownContext,
} from "./dropdown-context";

type DropDownProps = React.ComponentPropsWithoutRef<"div">;

export function DropDownRootProvider<TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement, DropDownProps> & { value: DropdownContext }
) {
	const { as: Element = "div", value, ...restOfProps } = props;

	return (
		<DropdownContextProvider value={value}>
			<Element {...restOfProps} />
		</DropdownContextProvider>
	);
}

export function DropDownRoot<TElement extends React.ElementType = "div">(
	props: Omit<InferProps<typeof DropDownRootProvider<TElement>>, "value">
) {
	const dropdown = useDropdown();

	return <DropDownRootProvider value={dropdown} {...(props as object)} />;
}

export function DropDownTrigger(props: InferProps<"button"> & { asChild?: boolean }) {
	const { asChild = false, className, ...restOfProps } = props;

	const Component = asChild ? Slot.Root : "button";

	const { onToggle } = useDropdownContext();

	return (
		<Component
			type="button"
			{...restOfProps}
			className={cnMerge("w-full", className)}
			onClick={composeTwoEventHandlers(onToggle, restOfProps.onClick)}
		/>
	);
}

type DropDownContentProps = Pick<DropDownProps, "children" | "id"> & {
	classNames?: {
		base?: string;
		listContainer?: string;
	};
};

export function DropDownContent(props: DropDownContentProps) {
	const { children, classNames, id = "" } = props;

	const { isOpen } = useDropdownContext();

	return (
		<div
			id={id}
			className={cnMerge(
				"invisible grid grid-rows-[0fr] transition-[visibility,grid-template-rows] duration-500",
				isOpen && "visible grid-rows-[1fr]",
				classNames?.base
			)}
		>
			<ul
				className={cnMerge("overflow-y-hidden [transition:padding_500ms]", classNames?.listContainer)}
			>
				{children}
			</ul>
		</div>
	);
}

function DropDownContext(props: DiscriminatedRenderProps<(ctx: DropdownContext) => React.ReactNode>) {
	const { children, render } = props;
	const dropDownCtx = useDropdownContext();

	if (typeof children === "function") {
		return children(dropDownCtx);
	}

	return render(dropDownCtx);
}

export const Context = DropDownContext;
export const Content = DropDownContent;
export const Trigger = DropDownTrigger;
export const RootProvider = DropDownRootProvider;
export const Root = DropDownRoot;
