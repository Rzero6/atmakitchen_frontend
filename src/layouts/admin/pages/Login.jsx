import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import FormLogin from "../../../components/form/FormLogin";
import { toast } from "react-toastify";
// import "./Form.css";
export const AdminLoginPage = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const tokenDariSS = sessionStorage.getItem("token");
    const roleDariSS = sessionStorage.getItem("role");
    setToken(tokenDariSS);
    if (tokenDariSS) {
      if (roleDariSS === "Customer") navigate("/");
      else navigate("/admin");
    }
  }, [navigate]);
  return (
    !token && (
      <Container className="login-container">
        <div className="login-box">
          <div className="text-center mb-3">
            <h1 className="mt-3 pb-1 fw-bold text-light">Sign In</h1>
          </div>
          <FormLogin />
        </div>
      </Container>
    )
  );
};
