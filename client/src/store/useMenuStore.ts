import axios from "@/axios"; // 👈 use this path according to your project structure
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";

const API_END_POINT = "http://localhost:8000/api/v1/menu";
axios.defaults.withCredentials = true;

type MenuState = {
  loading: boolean,
  menu: any | null,
  createMenu: (formData: FormData) => Promise<void>;
  editMenu: (menuId: string, formData: FormData) => Promise<void>;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      loading: false,
      menu: null,

      createMenu: async (formData: FormData) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({ menu: response.data.menu });
            // update restaurant
            useRestaurantStore.getState().addMenuToRestaurant(response.data.menu);
          } else {
            toast.error("Something went wrong while creating menu.");
          }
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Error creating menu");
        } finally {
          set({ loading: false }); // ✅ always stop loading
        }
      },

      editMenu: async (menuId: string, formData: FormData) => {
        set({ loading: true });
        try {
          const response = await axios.put(`${API_END_POINT}/${menuId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({ menu: response.data.menu });
            useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu);
          } else {
            toast.error("Something went wrong while editing menu.");
          }
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Error editing menu");
        } finally {
          set({ loading: false }); // ✅ always stop loading
        }
      }
    }),
    {
      name: "menu-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
