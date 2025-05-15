import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "@/axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = "https://smart-restaurant-zdmu.onrender.com/user";

type User = {
  _id: string;
  fullname: string;
  email: string;
  contact: number;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
  role: "user" | "admin" | "restaurant_owner";
  restaurant?: any;
};

type UpdateProfileInput = Partial<User>;

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input: SignupInputState) => Promise<void>;
  login: (input: LoginInputState) => Promise<void>;
  verifyEmail: (verificationCode: string) => Promise<void>;
  checkAuthentication: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  makeAdmin: () => Promise<void>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      loading: false,

      signup: async (input) => {
        try {
          set({ loading: true });
          const { data } = await axiosInstance.post(`${API_END_POINT}/signup`, input);
          toast.success(data.message);
          set({ user: data.user, isAuthenticated: true });
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Signup failed");
        } finally {
          set({ loading: false });
        }
      },

      login: async (input) => {
        try {
          set({ loading: true });
          const { data } = await axiosInstance.post(`${API_END_POINT}/login`, input);
          toast.success(data.message);
          set({ user: data.user, isAuthenticated: true });
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Login failed");
        } finally {
          set({ loading: false });
        }
      },

      verifyEmail: async (verificationCode) => {
        try {
          set({ loading: true });
          const { data } = await axiosInstance.post(`${API_END_POINT}/verify-email`, { verificationCode });
          toast.success(data.message);
          set({ user: data.user, isAuthenticated: true });
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Verification failed");
        } finally {
          set({ loading: false });
        }
      },

      checkAuthentication: async () => {
        try {
          if (!get().isCheckingAuth) set({ isCheckingAuth: true });

          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Auth check timeout")), 2000)
          );

          const response = await Promise.race([
            axiosInstance.get(`${API_END_POINT}/check-auth`),
            timeout,
          ]) as any;

          const { data } = response;
          if (data.success) {
            console.log("User data from check-auth:", data.user);
            set({
              user: data.user,
              isAuthenticated: true,
              isCheckingAuth: false,
              loading: false,
            });
          }
        } catch (error) {
          console.error("Auth check error:", error);
          set({
            user: null,
            isAuthenticated: false,
            isCheckingAuth: false,
            loading: false,
          });
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          const { data } = await axiosInstance.post(`${API_END_POINT}/logout`);
          toast.success(data.message);
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            isCheckingAuth: false,
          });
          window.location.href = "/login";
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Logout failed");
          set({ loading: false });
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ loading: true });
          const { data } = await axiosInstance.post(`${API_END_POINT}/forgot-password`, { email });
          toast.success(data.message);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to send reset email");
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          set({ loading: true });
          const { data } = await axiosInstance.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
          toast.success(data.message);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Password reset failed");
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (input) => {
        try {
          const { data } = await axiosInstance.put(`${API_END_POINT}/profile/update`, input);
          toast.success(data.message);
          set({ user: data.user });
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update profile");
        }
      },

      makeAdmin: async () => {
        try {
          set({ loading: true });
          const { data } = await axiosInstance.post(`${API_END_POINT}/make-admin`);
          toast.success(data.message);
          set({ user: data.user });
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to make user admin");
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
