import { createReactStore } from "@zayne-labs/toolkit-react/zustand-compat";
import { toast } from "sonner";
import type { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import type { ShopStore } from "./types";

const toastMessages = {
	added: "Product added successfully",
	removed: "Product was removed from cart",
	updated: "Item quantity has been updated",
};

// Store Object creation
const shopStateObjectFn: StateCreator<ShopStore> = (set, get) => ({
	cart: [],
	/* eslint-disable perfectionist/sort-objects */
	wishList: [],

	totalPrice: 0,

	actions: {
		/* eslint-enable perfectionist/sort-objects */

		addToCart: (productItem) => {
			const { cart } = get();

			const isProductItemInCart = cart.some((item) => item.id === productItem.id);

			if (isProductItemInCart) {
				const { incrementProductQuantity } = get().actions;

				incrementProductQuantity(productItem.id);

				return;
			}

			set({ cart: [...cart, { ...productItem, quantity: 1 }] });

			toast.success(toastMessages.added, { position: "top-center" });
		},

		clearCart: () => set({ cart: [] }),

		decrementProductQuantity: (productId) => {
			const { removeProductFromCart, updateProductQuantity } = get().actions;

			const productItemInCart = get().cart.find((item) => item.id === productId);

			if (!productItemInCart) return;

			if (productItemInCart.quantity === 1) {
				removeProductFromCart(productId);
				return;
			}

			updateProductQuantity(productId, { updatedQuantity: productItemInCart.quantity - 1 });

			toast.success(toastMessages.updated, { position: "top-center" });
		},

		incrementProductQuantity: (productId) => {
			const { updateProductQuantity } = get().actions;

			const productItemInCart = get().cart.find((item) => item.id === productId);

			if (!productItemInCart || productItemInCart.quantity >= productItemInCart.stock) return;

			updateProductQuantity(productId, { updatedQuantity: productItemInCart.quantity + 1 });

			toast.success(toastMessages.updated, { position: "top-center" });
		},

		removeProductFromCart: (productId) => {
			const updatedCart = get().cart.filter((item) => item.id !== productId);

			set({ cart: updatedCart });

			toast.success(toastMessages.removed, { position: "top-center" });
		},

		toggleAddToWishList: (productItem) => {
			const { wishList } = get();
			const isItemInWishList = wishList.some((item) => item.id === productItem.id);

			const newWishList =
				!isItemInWishList ?
					[...wishList, productItem]
				:	wishList.filter((item) => item.id !== productItem.id);

			set({ wishList: newWishList });
		},

		updateProductQuantity: (productId, { updatedQuantity }) => {
			const { cart } = get();

			const updatedCart = cart.map((item) => {
				if (item.id === productId) {
					return {
						...item,
						quantity: updatedQuantity > 1 ? updatedQuantity : item.quantity,
					};
				}
				return item;
			});

			set({ cart: updatedCart });
		},
	},
});

export const useShopStore = createReactStore(
	persist(shopStateObjectFn, {
		name: "shop",
		partialize: ({ actions: _ignoredActions, ...actualState }) => actualState,
		version: 1,
	})
);

useShopStore.subscribe.withSelector(
	(state) => state.cart,
	(cart) => {
		const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

		useShopStore.setState({ totalPrice });
	}
);
