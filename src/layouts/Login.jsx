import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import FormLogin from "../components/form/FormLogin";
import videoLoginBg from "../assets/login_background.mp4";
import "./index.css";
export const LoginPage = () => {
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
              <h1 className="p-3 fw-bold text-primary">Sign In</h1>
            </div>
            <FormLogin />
          </Card>
        </div>
      </div>
    )
  );
};
