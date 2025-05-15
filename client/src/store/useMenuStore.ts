import axios from "@/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";

const API_END_POINT = "http://localhost:8000/api/v1/menu";
axios.defaults.withCredentials = true;

type MenuState = {
  loading: boolean;
  menu: any[]; // ✅ Now array of menu items
  fetchAllMenus: () => Promise<void>; // ✅ new function
  createMenu: (formData: FormData) => Promise<void>;
  editMenu: (menuId: string, formData: FormData) => Promise<void>;
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      loading: false,
      menu: [], // ✅ initialize as empty array

      fetchAllMenus: async () => {
        set({ loading: true });
        try {
          const response = await axios.get(`${API_END_POINT}/`);
          if (response.data.success) {
            set({ menu: response.data.menus }); // assuming backend returns { success: true, menus: [...] }
          } else {
            toast.error("Failed to fetch menus.");
          }
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Error fetching menus");
        } finally {
          set({ loading: false });
        }
      },

      createMenu: async (formData: FormData) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            toast.success(response.data.message);
            // update local menu
            set((state) => ({ menu: [...state.menu, response.data.menu] }));
            useRestaurantStore.getState().addMenuToRestaurant(response.data.menu);
          } else {
            toast.error("Something went wrong while creating menu.");
          }
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Error creating menu");
        } finally {
          set({ loading: false });
        }
      },

      editMenu: async (menuId: string, formData: FormData) => {
        set({ loading: true });
        try {
          const response = await axios.put(`${API_END_POINT}/${menuId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set((state) => ({
              menu: state.menu.map((item) =>
                item._id === response.data.menu._id ? response.data.menu : item
              ),
            }));
            useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu);
          } else {
            toast.error("Something went wrong while editing menu.");
          }
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Error editing menu");
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "menu-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
