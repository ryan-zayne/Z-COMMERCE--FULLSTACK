import { cnMerge } from "@/lib/utils/cn";

function Skeleton(props: React.ComponentProps<"div">) {
	const { className, ...restProps } = props;

	return (
		<div
			data-slot="skeleton"
			className={cnMerge("animate-pulse rounded-md bg-shadcn-accent", className)}
			{...restProps}
		/>
	);
}

export { Skeleton };
