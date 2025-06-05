import { CartState } from "@/types/cartType";
import { MenuItem } from "@/types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      restaurantId: null,

      addToCart: (item: MenuItem) => {
        const currentRestaurantId = get().restaurantId;

        if (!currentRestaurantId || currentRestaurantId === item.restaurantId) {
          set((state) => {
            const existingItem = state.cart.find(
              (cartItem) => cartItem._id === item._id
            );

            const updatedCart = existingItem
              ? state.cart.map((cartItem) =>
                  cartItem._id === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
                )
              : [...state.cart, { ...item, quantity: 1 }];

            return {
              cart: updatedCart,
              restaurantId: state.restaurantId || item.restaurantId,
            };
          });
        } else {
          alert("You can only add items from one restaurant at a time.");
        }
      },

      clearCart: () => {
        set({ cart: [], restaurantId: null });
      },

      removeFromTheCart: (id: string) => {
        set((state) => {
          const updatedCart = state.cart.filter((item) => item._id !== id);
          const newRestaurantId = updatedCart.length > 0 ? state.restaurantId : null;

          return {
            cart: updatedCart,
            restaurantId: newRestaurantId,
          };
        });
      },

      incrementQuantity: (id: string) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }));
      },

      decrementQuantity: (id: string) => {
        set((state) => {
          const updatedCart = state.cart
            .map((item) =>
              item._id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0);

          return {
            cart: updatedCart,
            restaurantId: updatedCart.length > 0 ? state.restaurantId : null,
          };
        });
      },
    }),
    {
      name: "cart-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
