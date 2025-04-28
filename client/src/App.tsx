// import Login from "./auth/Login";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Signup from "./auth/Signup";
// import ForgotPassword from "./auth/ForgotPassword";
// import ResetPassword from "./auth/ResetPassword";
// import VerifyEmail from "./auth/VerifyEmail";
// import HereSection from "./components/HereSection";
// import MainLayout from "./layout/MainLayout";
// import Profile from "./components/Profile";
// import SearchPage from "./components/SearchPage";
// import RestaurantDetail from "./components/RestaurantDetail";
// import Cart from "./components/Cart";
// import Restaurant from "./admin/Restaurant";
// import AddMenu from "./admin/AddMenu";
// import Orders from "./admin/Orders";
// import Success from "./components/Success";
// import { useUserStore } from "./store/useUserStore";
// import { Navigate, Outlet } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Loading from "./components/Loading";
// import { useThemeStore } from "./store/useThemeStore";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "sonner";

// const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, user } = useUserStore();
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!user?.isVerified) {
//     return <Navigate to="/verify-email" replace />;
//   }
//   return children;
// };

// const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, user } = useUserStore();
//   if (isAuthenticated && user?.isVerified) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

// const AdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, isAuthenticated, isCheckingAuth } = useUserStore();

//   if (isCheckingAuth) return <Loading />;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Allow access if user is admin OR restaurant_owner
//   if (!user || (user.role !== "admin" && user.role !== "restaurant_owner")) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <ProtectedRoutes>
//         <MainLayout />
//       </ProtectedRoutes>
//     ),
//     children: [
//       { path: "", element: <HereSection /> },
//       { path: "profile", element: <Profile /> },
//       { path: "search/:text", element: <SearchPage /> },
//       { path: "restaurant/:id", element: <RestaurantDetail /> },
//       { path: "cart", element: <Cart /> },
//       { path: "order/success", element: <Success /> },

//       // ✅ Fixed Admin Routes (no starting slash)
//       { path: "admin/restaurant", element: <AdminRoute><Restaurant /></AdminRoute> },
//       { path: "admin/menu", element: <AdminRoute><AddMenu /></AdminRoute> },
//       { path: "admin/orders", element: <AdminRoute><Orders /></AdminRoute> },
//     ],
//   },

//   // Public routes
//   { path: "/login", element: <AuthenticatedUser><Login /></AuthenticatedUser> },
//   { path: "/signup", element: <AuthenticatedUser><Signup /></AuthenticatedUser> },
//   { path: "/forgot-password", element: <ForgotPassword /> },
//   { path: "/reset-password", element: <ResetPassword /> },
//   { path: "/verify-email", element: <VerifyEmail /> },
//   { path: "/order/success", element: <Success /> },
// ]);

// function App() {
//   const { isAuthenticated, checkAuthentication, isCheckingAuth, user } = useUserStore();
//   const [initialLoad, setInitialLoad] = useState(true);

//   // Get current path
//   const currentPath = window.location.pathname;
//   const isPublicRoute = currentPath === '/login' || 
//                         currentPath === '/signup' || 
//                         currentPath === '/verify-email' || 
//                         currentPath === '/forgot-password' || 
//                         currentPath.startsWith('/reset-password');

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         // Only check authentication if not on public routes
//         if (!isPublicRoute) {
//           await checkAuthentication();
//         }
//       } catch (error) {
//         console.error("Error during authentication check:", error);
//       } finally {
//         // Add a small delay before hiding the loading screen
//         setTimeout(() => {
//           setInitialLoad(false);
//         }, 500);
//       }
//     };

//     initializeAuth();
//   }, [checkAuthentication, isPublicRoute]);

//   // Show loading screen during initial load or authentication check (but not on public routes)
//   if (initialLoad && !isPublicRoute) {
//     return <Loading />;
//   }

//   return (
//     <BrowserRouter>
//       <Toaster position="top-center" richColors />
//       <Routes>
//         {/* Public Routes */}
//         <Route
//           path="/login"
//           element={
//             isAuthenticated ? (
//               <Navigate to="/" replace />
//             ) : (
//               <Login />
//             )
//           }
//         />
//         <Route
//           path="/signup"
//           element={
//             isAuthenticated ? (
//               <Navigate to="/" replace />
//             ) : (
//               <Signup />
//             )
//           }
//         />
//         <Route
//           path="/forgot-password"
//           element={<ForgotPassword />}
//         />
//         <Route
//           path="/reset-password"
//           element={
//             <ResetPassword />
//           }
//         />
//         <Route
//           path="/verify-email"
//           element={
//             isAuthenticated && !user?.isVerified ? (
//               <VerifyEmail />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />

//         {/* Protected Routes with MainLayout */}
//         <Route
//           path="/"
//           element={
//             isAuthenticated && user?.isVerified ? (
//               <MainLayout />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         >
//           <Route index element={<HereSection />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="search/:text" element={<SearchPage />} />
//           <Route path="restaurant/:id" element={<RestaurantDetail />} />
//           <Route path="cart" element={<Cart />} />
//           <Route path="order/success" element={<Success />} />
          
//           {/* Admin Routes */}
//           <Route
//             path="admin/restaurant"
//             element={
//               user?.role === "admin" || user?.role === "restaurant_owner" ? (
//                 <Restaurant />
//               ) : (
//                 <Navigate to="/" replace />
//               )
//             }
//           />
//           <Route
//             path="admin/menu"
//             element={
//               user?.role === "admin" || user?.role === "restaurant_owner" ? (
//                 <AddMenu />
//               ) : (
//                 <Navigate to="/" replace />
//               )
//             }
//           />
//           <Route
//             path="admin/orders"
//             element={
//               user?.role === "admin" || user?.role === "restaurant_owner" ? (
//                 <Orders />
//               ) : (
//                 <Navigate to="/" replace />
//               )
//             }
//           />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import Login from "./auth/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import VerifyEmail from "./auth/VerifyEmail";
import HereSection from "./components/HereSection";
import MainLayout from "./layout/MainLayout";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Restaurant from "./admin/Restaurant";
import AddMenu from "./admin/AddMenu";
import Orders from "./admin/Orders";
import Success from "./components/Success";
import { useUserStore } from "./store/useUserStore";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import { useThemeStore } from "./store/useThemeStore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// ✅ Chatbot Import
import Chatbot from "./components/Chatbot";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isCheckingAuth } = useUserStore();

  if (isCheckingAuth) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow access if user is admin OR restaurant_owner
  if (!user || (user.role !== "admin" && user.role !== "restaurant_owner")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, checkAuthentication, isCheckingAuth, user } = useUserStore();
  const [initialLoad, setInitialLoad] = useState(true);

  // Get current path
  const currentPath = window.location.pathname;
  const isPublicRoute = currentPath === '/login' || 
                        currentPath === '/signup' || 
                        currentPath === '/verify-email' || 
                        currentPath === '/forgot-password' || 
                        currentPath.startsWith('/reset-password');

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Only check authentication if not on public routes
        if (!isPublicRoute) {
          await checkAuthentication();
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
      } finally {
        // Add a small delay before hiding the loading screen
        setTimeout(() => {
          setInitialLoad(false);
        }, 500);
      }
    };

    initializeAuth();
  }, [checkAuthentication, isPublicRoute]);

  // Show loading screen during initial load or authentication check (but not on public routes)
  if (initialLoad && !isPublicRoute) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Signup />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/verify-email"
          element={
            isAuthenticated && !user?.isVerified ? (
              <VerifyEmail />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Protected Routes with MainLayout */}
        <Route
          path="/"
          element={
            isAuthenticated && user?.isVerified ? (
              <MainLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<HereSection />} />
          <Route path="profile" element={<Profile />} />
          <Route path="search/:text" element={<SearchPage />} />
          <Route path="restaurant/:id" element={<RestaurantDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order/success" element={<Success />} />
          
          {/* Admin Routes */}
          <Route
            path="admin/restaurant"
            element={
              user?.role === "admin" || user?.role === "restaurant_owner" ? (
                <Restaurant />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="admin/menu"
            element={
              user?.role === "admin" || user?.role === "restaurant_owner" ? (
                <AddMenu />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="admin/orders"
            element={
              user?.role === "admin" || user?.role === "restaurant_owner" ? (
                <Orders />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Route>
      </Routes>

      {/* ✅ Chatbot Floating Button (always at bottom) */}
      {isAuthenticated && user?.isVerified && <Chatbot />}
    </BrowserRouter>
  );
}

export default App;
