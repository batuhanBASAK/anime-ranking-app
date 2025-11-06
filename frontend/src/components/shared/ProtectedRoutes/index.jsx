import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../AuthProvider/useAuth";

function ProtectedRoutes({ allowedRoles }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userRole = user ? user.role : "null";

  if (!allowedRoles.includes(userRole)) {
    navigate("/", { replace: true });
  }

  return <Outlet />;
}

export default ProtectedRoutes;
