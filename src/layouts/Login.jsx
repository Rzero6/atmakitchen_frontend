import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Button, Stack } from "react-bootstrap";
import FormLogin from "../components/form/FormLogin";
import videoLoginBg from "../assets/login_background.mp4";
import "./index.css";
import FormRegister from "../components/form/FormRegister";
export const LoginPage = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  useEffect(() => {
    const tokenDariSS = sessionStorage.getItem("token");
    const roleDariSS = sessionStorage.getItem("role");
    setToken(tokenDariSS);
    if (tokenDariSS) {
      if (roleDariSS === "Customer") navigate("/");
      else if (userRole === "Admin") navigate("/admin");
      else if (userRole === "Manager Operasional") navigate("/mo");
      else if (userRole === "Owner") navigate("/owner");
      else navigate("/login");
    }
  }, [navigate]);
  return (
    !token && (
      <div className="video-container">
        <video src={videoLoginBg} autoPlay loop muted></video>
        <div className="content">
          <Card
            className="p-4"
            style={{
              backdropFilter: "blur(8px)",
              backgroundColor: "transparent",
              border: "1px solid gray",
              borderRadius: "10px",
            }}
          >
            <div className="text-center">
              <h1 className="p-3 fw-bold text-primary">
                Sign {showLogin ? "In" : "Up"}
              </h1>
            </div>
            {showLogin ? <FormLogin /> : <FormRegister />}
            <Stack className="px-4 " gap={3}>
              <Button
                variant="success"
                className="btn btn-lg"
                onClick={() => setShowLogin(!showLogin)}
              >
                {showLogin ? "Register" : "Login"}
              </Button>
              <Button
                variant="secondary"
                className="btn btn-lg"
                onClick={() => navigate("/")}
              >
                Guest
              </Button>
            </Stack>
          </Card>
        </div>
      </div>
    )
  );
};
