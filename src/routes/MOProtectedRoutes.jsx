import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
/* eslint-disable react/prop-types */
const MOProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  useEffect(() => {
    const tokenDariSS = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userRole = sessionStorage.getItem("role");
    setToken(tokenDariSS);
    if (userRole !== "Manager Operasional") {
      if (userRole === "Customer") navigate("/");
      else if (userRole === "Admin") navigate("/admin");
      else if (userRole === "Owner") navigate("/owner");
      else navigate("/login");
    }
    if (!tokenDariSS) {
      navigate("/login");
    }
  }, [navigate]);
  return token && (children ? children : <Outlet />);
};
export default MOProtectedRoutes;
