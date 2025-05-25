import { Orders } from "@/types/orderType";
import { MenuItem, RestaurantState } from "@/types/restaurantType";
import axiosInstance from "@/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./useUserStore";

// Use the configured axios instance
const API_END_POINT = "/restaurant";

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      loading: false,
      restaurant: null,
      restaurants: [],
      searchedRestaurant: null,
      appliedFilter: [],
      singleRestaurant: null,
      restaurantOrder: [],
      menuItems: [],

      createRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axiosInstance.post(`${API_END_POINT}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            await get().getRestaurant(); // Refresh the restaurant list after creation
            await useUserStore.getState().checkAuthentication();
          }
        } catch (error: any) {
          console.error("Error creating restaurant:", error);
          toast.error(error.response?.data?.message || "Failed to create restaurant.");
        } finally {
          set({ loading: false });
        }
      },

      getRestaurant: async () => {
        try {
          set({ loading: true });
          const response = await axiosInstance.get(`${API_END_POINT}/`);
          console.log("Fetched restaurant data:", response.data);

          if (response.data.success) {
            const restaurantData = response.data.restaurant;
            set({
              restaurant: restaurantData,
              restaurants: restaurantData ? [restaurantData] : [],
              menuItems: restaurantData?.menus || [],
            });
          } else {
            console.log("No restaurant data found");
            set({ restaurant: null, restaurants: [], menuItems: [] });
          }
        } catch (error: any) {
          console.error("Error fetching restaurant:", error);
          set({ restaurant: null, restaurants: [], menuItems: [] });
          if (error.response?.status !== 404) {
            toast.error(error.response?.data?.message || "Failed to fetch restaurant data");
          }
        } finally {
          set({ loading: false });
        }
      },

      // 🚀 Newly added fetchSmartRestaurants function
      fetchSmartRestaurants: async (sortBy = "random") => {
        try {
          set({ loading: true });
          const response = await axiosInstance.get(`${API_END_POINT}/smart-restaurants?sortBy=${sortBy}`);
          if (response.data.success) {
            set({ restaurants: response.data.restaurants });
          }
        } catch (error: any) {
          console.error("Error fetching smart restaurants:", error);
          toast.error(error.response?.data?.message || "Failed to fetch smart restaurants.");
        } finally {
          set({ loading: false });
        }
      },

      updateRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axiosInstance.put(`${API_END_POINT}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (response.data.success) {
            toast.success(response.data.message);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update restaurant.");
        } finally {
          set({ loading: false });
        }
      },

      searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: string[]) => {
        try {
          set({ loading: true });

          const params = new URLSearchParams();
          params.set("searchQuery", searchQuery);
          params.set("selectedCuisines", selectedCuisines.join(","));

          const response = await axiosInstance.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
          if (response.data.success) {
            set({ searchedRestaurant: response.data });
          }
        } catch {
          // Optional: show toast if needed
        } finally {
          set({ loading: false });
        }
      },

      addMenuToRestaurant: (menu: MenuItem) => {
        set((state) => ({
          restaurant: state.restaurant
            ? { ...state.restaurant, menus: [...state.restaurant.menus, menu] }
            : null,
          menuItems: [...state.menuItems, menu],
        }));
      },

      updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state) => {
          if (!state.restaurant) return state;

          const updatedMenus = state.restaurant.menus.map((menu) =>
            menu._id === updatedMenu._id ? updatedMenu : menu
          );

          return {
            restaurant: { ...state.restaurant, menus: updatedMenus },
            menuItems: updatedMenus,
          };
        });
      },

      setAppliedFilter: (value: string[]) => {
        set({ appliedFilter: value });
      },

      resetAppliedFilter: () => {
        set({ appliedFilter: [] });
      },

      getSingleRestaurant: async (restaurantId: string) => {
        try {
          const response = await axiosInstance.get(`${API_END_POINT}/${restaurantId}`);
          if (response.data.success) {
            set({ singleRestaurant: response.data.restaurant });
          }
        } catch {
          // Optional error handling
        }
      },

      getRestaurantOrders: async () => {
        try {
          const response = await axiosInstance.get(`${API_END_POINT}/order`);
          if (response.data.success) {
            set({ restaurantOrder: response.data.orders });
          } else {
            toast.error(response.data.message || "Failed to fetch orders");
          }
        } catch (error: any) {
          console.log("Error fetching orders", error);
          toast.error(error?.response?.data?.message || "Failed to fetch orders");
        }
      },

      updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
          const response = await axiosInstance.put(
            `${API_END_POINT}/order/${orderId}/status`,
            { status },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data.success) {
            const updatedOrders = get().restaurantOrder.map((order) =>
              order._id === orderId ? { ...order, status } : order
            );
            set({ restaurantOrder: updatedOrders });
            toast.success(response.data.message || "Order updated successfully");
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update order.");
        }
      },

    }),
    {
      name: "restaurant-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
