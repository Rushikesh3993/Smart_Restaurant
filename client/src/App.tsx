import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useUserStore } from "./store/useUserStore";
import { Toaster } from "sonner";

// Public Pages
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import VerifyEmail from "./auth/VerifyEmail";

// Main Layout & Components
import MainLayout from "./layout/MainLayout";
import HereSection from "./components/HereSection";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Success from "./components/Success";

// Admin Pages
import Restaurant from "./admin/Restaurant";
import AddMenu from "./admin/AddMenu";
import Orders from "./admin/Orders";

// Utilities
import Loading from "./components/Loading";
import Chatbot from "./components/Chatbot";

const ProtectedRoute = () => {
  const { isAuthenticated, user, isCheckingAuth } = useUserStore();
  
  if (isCheckingAuth) return <Loading />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

const AdminRoute = () => {
  const { isAuthenticated, user, isCheckingAuth } = useUserStore();

  if (isCheckingAuth) return <Loading />;
  if (!isAuthenticated || !user || (user.role !== "admin" && user.role !== "restaurant_owner")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const App = () => {
  const { isAuthenticated, user, checkAuthentication } = useUserStore();
  const [initialLoad, setInitialLoad] = useState(true);
  const location = useLocation();

  const publicPaths = ["/login", "/signup", "/forgot-password", "/verify-email"];
  const isPublicRoute = publicPaths.some((p) => location.pathname.startsWith(p)) || 
                       location.pathname.startsWith("/reset-password");

  useEffect(() => {
    const initialize = async () => {
      if (!isPublicRoute) {
        await checkAuthentication();
      }
      setTimeout(() => setInitialLoad(false), 500);
    };
    initialize();
  }, [checkAuthentication, isPublicRoute]);

  if (initialLoad && !isPublicRoute) return <Loading />;

  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/verify-email"
          element={isAuthenticated && !user?.isVerified ? <VerifyEmail /> : <Navigate to="/" replace />}
        />

        {/* Protected Main Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HereSection />} />
            <Route path="profile" element={<Profile />} />
            <Route path="search/:text" element={<SearchPage />} />
            <Route path="restaurant/:id" element={<RestaurantDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="order/success" element={<Success />} />

            {/* Admin Sub-Routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin/restaurant" element={<Restaurant />} />
              <Route path="admin/menu" element={<AddMenu />} />
              <Route path="admin/orders" element={<Orders />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      {/* Chatbot Floating Component */}
      {/* {isAuthenticated && user?.isVerified && <Chatbot />} */}
    </>
  );
};

// Wrap the App with BrowserRouter
const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;

