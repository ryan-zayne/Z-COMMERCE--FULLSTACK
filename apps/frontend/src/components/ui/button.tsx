import type { InferProps, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { tv, type VariantProps } from "tailwind-variants";
import { cnJoin } from "@/lib/utils/cn";
import { IconBox } from "../common/IconBox";
import { Slot } from "../primitives/slot";

export type ButtonProps = InferProps<"button">
	& VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		unstyled?: boolean;
	};

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = tv({
	base: "flex items-center justify-center",

	variants: {
		isDisabled: {
			true: "cursor-not-allowed brightness-50",
		},

		isLoading: {
			true: "grid",
		},

		size: {
			lg: "px-[45px] py-[11px]",
			md: "px-[35px] py-[11px]",
			sm: "px-[13px] py-[11px]",
		},

		theme: {
			ghost: "bg-transparent text-dark",
			primary: "bg-primary text-white",
			secondary: "bg-secondary text-primary",
		},

		variant: {
			cart: "rounded-[8px]",
			input: "rounded-r-[25px]",
			regular: "rounded-[5px]",
			shop: "rounded-[25px]",
		},
	},

	// eslint-disable-next-line perfectionist/sort-objects
	defaultVariants: {
		size: "md",
		theme: "ghost",
		variant: "regular",
	},
});

function Button<TElement extends React.ElementType>(props: PolymorphicProps<TElement, ButtonProps>) {
	const {
		as: Element = "button",
		asChild,
		children,
		className,
		isDisabled = false,
		disabled = isDisabled,
		isLoading = false,
		loadingStyle = "replace-content",
		size,
		theme,
		type = "button",
		unstyled,
		...restOfProps
	} = props;

	const Component = asChild ? Slot.Root : Element;

	const BTN_CLASSES =
		!unstyled ?
			buttonVariants({
				className,
				isDisabled,
				isLoading,
				size,
				theme,
			})
		:	className;

	const withIcon = (
		<>
			<Slot.Slottable>
				{loadingStyle === "replace-content" ?
					<div className="invisible [grid-area:1/1]">{children}</div>
				:	children}
			</Slot.Slottable>

			<span
				className={cnJoin(
					"flex justify-center",
					loadingStyle === "replace-content" && "[grid-area:1/1]"
				)}
			>
				<IconBox icon="svg-spinners:ring-resize" className="size-6 text-white" />
			</span>
		</>
	);

	// == This technique helps prevents content shift when replacing children with spinner icon
	return (
		<Component type={type} className={BTN_CLASSES} disabled={disabled || isDisabled} {...restOfProps}>
			{isLoading ? withIcon : children}
		</Component>
	);
}
export { Button };
