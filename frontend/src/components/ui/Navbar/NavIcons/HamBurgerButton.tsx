import { Button } from "@/components/primitives/button";
import { IconBox } from "@/components/primitives/IconBox";
import { useGlobalStore } from "@/store/zustand/globalStore";

function HamBurgerButton() {
	const { toggleNavShow } = useGlobalStore((state) => state.actions);

	return (
		<Button unstyled={true} id="Hamburger" className="w-[26px]" onClick={toggleNavShow}>
			<IconBox icon="ri:menu-3-fill" />
		</Button>
	);
}
export { HamBurgerButton };
