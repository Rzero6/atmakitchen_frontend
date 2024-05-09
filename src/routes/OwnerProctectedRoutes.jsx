import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
/* eslint-disable react/prop-types */
const OwnerProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  useEffect(() => {
    const tokenDariSS = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userRole = sessionStorage.getItem("role");
    setToken(tokenDariSS);
    if (userRole !== "Owner") {
      toast.dark("Unauthorized");
      if (userRole === "Customer") navigate("/");
      else if (userRole === "Admin") navigate("/admin");
      else if (userRole === "Manager Operasional") navigate("/mo");
      else navigate("/login");
    }
    if (!tokenDariSS) {
      navigate("/login");
    }
  }, [navigate]);
  return token && (children ? children : <Outlet />);
};
export default OwnerProtectedRoutes;
