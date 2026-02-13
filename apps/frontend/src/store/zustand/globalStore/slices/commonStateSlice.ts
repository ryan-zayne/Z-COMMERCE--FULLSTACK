import { lockScroll } from "@zayne-labs/toolkit-core";
import type { StateCreator } from "zustand";
import type { CommonStateSlice, GlobalStore } from "../../types";

export const createCommonStateSlice: StateCreator<GlobalStore, [], [], CommonStateSlice> = (set, get) => ({
	isNavShow: false,

	// eslint-disable-next-line perfectionist/sort-objects
	actions: {
		toggleNavShow: () => {
			set((state) => ({ isNavShow: !state.isNavShow }));
			lockScroll({ lock: get().isNavShow });
		},
	},
});
