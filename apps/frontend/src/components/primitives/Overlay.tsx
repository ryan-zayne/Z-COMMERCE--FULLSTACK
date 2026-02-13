import { cnMerge } from "@/lib/utils/cn";

type OverlayProps = {
	className?: string;
	isOpen: boolean;
	onClose: () => void;
};

function Overlay(props: OverlayProps) {
	const { className, isOpen, onClose } = props;

	return (
		<div
			onClick={onClose}
			className={cnMerge(
				"fixed inset-[0_0_0_auto] z-200 bg-[hsl(0,0%,0%,0.6)] [backdrop-filter:blur(4px)]",
				className,
				isOpen ? "w-screen" : "w-0"
			)}
		/>
	);
}

export { Overlay };
