import { createReactStore } from "@zayne-labs/toolkit-react/zustand-compat";
import type { StateCreator } from "zustand";
import type { GlobalStore } from "../types";
import { createCommonStateSlice } from "./slices/commonStateSlice";
import { createMediaQuerySlice } from "./slices/mediaQuerySlice";

// State Object creation
const globalStoreObjectFn: StateCreator<GlobalStore> = (...params) => {
	const sliceOne = createCommonStateSlice(...params);
	const sliceTwo = createMediaQuerySlice(...params);

	return {
		...sliceOne,
		...sliceTwo,

		actions: {
			...sliceOne.actions,
			...sliceTwo.actions,
		},
	};
};

// Store hook creation
export const useGlobalStore = createReactStore<GlobalStore>()(globalStoreObjectFn);
