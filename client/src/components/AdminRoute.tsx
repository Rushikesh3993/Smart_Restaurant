// src/components/ProtectedRoutes/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();
  console.log("User info", user);

  // Allow access if user is admin OR restaurant_owner
  if (!user || (user.role !== "admin" && user.role !== "restaurant_owner")) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
