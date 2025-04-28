import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axiosInstance from "@/axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

// Use the axios instance from axios.ts
const API_END_POINT = "/user";

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
}

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
  updateProfile: (input: any) => Promise<void>;
  makeAdmin: () => Promise<void>;
}

export const useUserStore = create<UserState>()(persist((set, get) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  loading: false,

  
  // signup api implementation
  signup: async (input: SignupInputState) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post(`${API_END_POINT}/signup`, input, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        set({ loading: false, user: response.data.user, isAuthenticated: true });
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },
  login: async (input: LoginInputState) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post(`${API_END_POINT}/login`, input, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        set({ loading: false, user: response.data.user, isAuthenticated: true });
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },
  verifyEmail: async (verificationCode: string) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        set({ loading: false, user: response.data.user, isAuthenticated: true });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
      set({ loading: false });
    }
  },
  checkAuthentication: async () => {
    try {
      // Only set isCheckingAuth to true if it's not already true
      // This prevents multiple state updates that can cause blinking
      if (!get().isCheckingAuth) {
        set({ isCheckingAuth: true });
      }
      
      // Add a shorter timeout to prevent long loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Authentication check timed out')), 2000);
      });
      
      const authPromise = axiosInstance.get(`${API_END_POINT}/check-auth`);
      
      const response = await Promise.race([authPromise, timeoutPromise]) as any;
      
      if (response.data.success) {
        console.log("User data from check-auth:", response.data.user);
        // Update all states at once to prevent blinking
        set({ 
          user: response.data.user, 
          isAuthenticated: true, 
          isCheckingAuth: false,
          loading: false 
        });
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      // Set all states at once to prevent blinking
      set({ 
        isAuthenticated: false, 
        isCheckingAuth: false,
        loading: false,
        user: null
      });
    }
  },
  logout: async () => {
    try {
      // Set loading state without triggering a re-render
      set((state) => ({ ...state, loading: true }));
      
      const response = await axiosInstance.post(`${API_END_POINT}/logout`, {});
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset all states at once to prevent blinking
        set({ 
          user: null, 
          isAuthenticated: false, 
          loading: false,
          isCheckingAuth: false 
        });
        
        // Force a page reload to clear any lingering state
        window.location.href = "/login";
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to logout");
      // Reset loading state on error
      set({ loading: false });
    }
  },
  forgotPassword: async (email: string) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post(`${API_END_POINT}/forgot-password`, { email });
      if (response.data.success) {
        toast.success(response.data.message);
        set({ loading: false });
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },
  resetPassword: async (token: string, newPassword: string) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  
  updateProfile: async (input: any) => {
    try {
      const response = await axiosInstance.put(`${API_END_POINT}/profile/update`, input, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        set({ user: response.data.user, isAuthenticated: true });
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },
  
  makeAdmin: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post(`${API_END_POINT}/make-admin`, {});
      if (response.data.success) {
        toast.success(response.data.message);
        set({ loading: false, user: response.data.user, isAuthenticated: true });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to make user admin");
      set({ loading: false });
    }
  },
}), {
  name: 'user-name',
  storage: createJSONStorage(() => localStorage),
}));
