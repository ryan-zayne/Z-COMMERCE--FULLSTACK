import { useScrollObserver } from "@zayne-labs/toolkit-react";
import { cnMerge } from "@/lib/utils/cn";
import { Button } from "../primitives/button";
import { IconBox } from "../primitives/IconBox";

function ScrollToTopButton() {
	const { isScrolled, observedElementRef } = useScrollObserver<HTMLDivElement>({
		rootMargin: "1000px 0px 0px",
	});

	return (
		<div
			ref={observedElementRef}
			className="fixed right-[20px] bottom-[20px] z-500"
			onClick={() => window.scrollTo(0, 0)}
		>
			<Button
				unstyled={true}
				className={cnMerge(
					`flex aspect-square w-[40px] translate-y-[-5000%] scale-[0] items-center justify-center
					rounded-[62%_38%_46%_54%/60%_63%_37%_40%] bg-secondary text-[20px] text-dark
					transition-[translate,scale] duration-400`,
					isScrolled && "translate-y-0 scale-[1] duration-1200 ease-in-out"
				)}
			>
				<IconBox icon="bi:chevron-up" />
			</Button>
		</div>
	);
}

export { ScrollToTopButton };
