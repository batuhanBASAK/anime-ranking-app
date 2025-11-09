import { Outlet, Navigate } from "react-router";
import { useAuth } from "../AuthProvider/useAuth";

function ProtectedRoutes({ allowedRoles }) {
  const { user } = useAuth();
  const userRole = user ? user.role : "null";
  const isAllowed = allowedRoles.includes(userRole);


  return isAllowed ? <Outlet /> : <Navigate to="/" replace={true} />;
}

export default ProtectedRoutes;
