import type { ProductItemSchemaType } from "../react-query/types";
import type { MEDIA_QUERY_LOOKUP } from "./globalStore/slices/mediaQuerySlice";

// Global State Types
export type CommonStateSlice = {
	actions: {
		toggleNavShow: () => void;
	};

	isNavShow: boolean;
};

export type MediaQuerySlice = {
	actions: {
		handleQueryListeners: (action: "add" | "remove") => void;
		setQuery: (query: keyof typeof MEDIA_QUERY_LOOKUP) => () => void;
	};
	isDesktop: boolean;
	isMobile: boolean;

	isTablet: boolean;
};

export type GlobalStore = CommonStateSlice & MediaQuerySlice;

// ShopState Types
export type ResponseDataItemInCart = ProductItemSchemaType & { quantity: number };

export type ShopStore = {
	actions: {
		addToCart: (productItem: ProductItemSchemaType) => void;

		clearCart: () => void;

		decrementProductQuantity: (productId: ProductItemSchemaType["id"]) => void;

		incrementProductQuantity: (productId: ProductItemSchemaType["id"]) => void;

		removeProductFromCart: (productId: ProductItemSchemaType["id"]) => void;

		toggleAddToWishList: (productItem: ProductItemSchemaType) => void;

		updateProductQuantity: (
			productId: ProductItemSchemaType["id"],
			newData: { updatedQuantity: number }
		) => void;
	};

	cart: ResponseDataItemInCart[];

	totalPrice: number;

	wishList: ProductItemSchemaType[];
};
