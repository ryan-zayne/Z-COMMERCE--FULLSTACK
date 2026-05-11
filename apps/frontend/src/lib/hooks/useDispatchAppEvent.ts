import { useEffectOnce } from "@zayne-labs/toolkit-react";

export const useDispatchAppEvent = () => {
	useEffectOnce(() => {
		document.dispatchEvent(new Event("app:ready"));
	});
};
