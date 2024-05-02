import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import FormLogin from "../../../components/form/FormLogin";
import { toast } from "react-toastify";

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
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <Card className="p-4">
          <div className="text-center">
            <h1 className="p-3 fw-bold">Sign In</h1>
          </div>
          <FormLogin />
        </Card>
      </Container>
    )
  );
};
