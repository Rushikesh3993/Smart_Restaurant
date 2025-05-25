import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axiosInstance from "@/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./useUserStore";

interface OrderStore {
  currentOrder: any;
  loading: boolean;
  error: string | null;
  createOrder: (orderData: any) => Promise<void>;
  getOrderById: (orderId: string) => Promise<void>;
  clearCurrentOrder: () => void;
  createCheckoutSession: (checkoutSession: CheckoutSessionRequest) => Promise<void>;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      currentOrder: null,
      loading: false,
      error: null,

      createOrder: async (orderData) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axiosInstance.post("/order", orderData);
          set({ currentOrder: data, loading: false });
          localStorage.setItem('currentOrderId', data._id);
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to create order",
            loading: false,
          });
          throw error;
        }
      },

      getOrderById: async (orderId: string) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axiosInstance.get(`/order/${orderId}`);
          set({ currentOrder: data, loading: false });
          localStorage.setItem('currentOrderId', data._id);
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch order",
            loading: false,
          });
          throw error;
        }
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
        localStorage.removeItem('currentOrderId');
      },

      createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
          set({ loading: true, error: null });

          // Transform price and quantity to numbers
          const transformedCartItems = checkoutSession.cartItems.map((item) => ({
            ...item,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
            quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
          }));

          const response = await axiosInstance.post(
            "/order/checkout/create-checkout-session",
            {
              ...checkoutSession,
              cartItems: transformedCartItems,
              restaurantId: checkoutSession.restaurantId,
            }
          );

          console.log("✅ Stripe session response:", response.data);

          if (response.data?.sessionUrl) {
            window.location.href = response.data.sessionUrl;
          } else {
            console.error("❌ Stripe session URL not found in response");
            toast.error("Failed to redirect to payment");
            set({ error: "Failed to redirect to payment" });
          }

          set({ loading: false });
        } catch (error: any) {
          console.error("❌ createCheckoutSession failed:", error?.response?.data || error.message);
          set({ 
            loading: false, 
            error: error?.response?.data?.message || "Failed to create checkout session" 
          });
          toast.error(error?.response?.data?.message || "Failed to create checkout session");
        }
      },
    }),
    {
      name: "order-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
