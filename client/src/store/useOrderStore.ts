import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


const API_END_POINT: string = "https://smart-restaurant-zdmu.onrender.com/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      loading: false,
      orders: [],

      createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
          set({ loading: true });

          console.log("Token from cookies (frontend):", document.cookie);

          // 🔁 Transform price and quantity to numbers
          const transformedCartItems = checkoutSession.cartItems.map((item) => ({
            ...item,
            price: Number(item.price),
            quantity: Number(item.quantity),
          }));

          const response = await axios.post(
            `${API_END_POINT}/checkout/create-checkout-session`,
            {
              ...checkoutSession,
              cartItems: transformedCartItems,
              restaurantId: checkoutSession.restaurantId, // Replace if dynamically fetched
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true, // ✅ Send cookie with request
            }
          );

          console.log("✅ Stripe session response:", response.data);

          if (response.data?.sessionUrl) {
            window.location.href = response.data.sessionUrl;
          }
           else {
            console.error("❌ Stripe session URL not found in response");
            toast.error("Failed to redirect to payment");
          }

          set({ loading: false });
        } catch (error: any) {
          console.error("❌ createCheckoutSession failed:", error?.response?.data || error.message);
          set({ loading: false });
        }
      },

      getOrderDetails: async () => {
        try {
          set({ loading: true });

          const response = await axios.get(`${API_END_POINT}/`, {
            withCredentials: true, // ✅ Automatically includes token cookie
          });

          set({ loading: false, orders: response.data.orders });
        } catch (error: any) {
          console.error("❌ getOrderDetails failed:", error?.response?.data || error.message);
          set({ loading: false });
        }
      },
    }),
    {
      name: "order-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
