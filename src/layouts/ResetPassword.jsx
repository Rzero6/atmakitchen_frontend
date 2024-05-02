import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResetPassword } from "../api/apiUserAuth";
import {
  Container,
  Card,
  Alert,
  Stack,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ status: null, message: "" });
  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const resetPassword = (event) => {
    event.preventDefault();
    setLoading(true);
    ResetPassword(data)
      .then((res) => {
        setResponse(res);
        toast.success(res.message);
      })
      .catch((err) => {
        setResponse(err);
        console.log(err);
        toast.dark(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Container style={{ height: "100vh", width: "100%" }}>
      <div className="content">
        <Card className="p-5">
          <Form onSubmit={resetPassword}>
            <Stack gap={3}>
              <h1 className="text-center">Reset Password</h1>
              <Alert variant="primary">
                Pastikan akun anda sudah di verifikasi melalui email
              </Alert>
              <TextField
                label="Email"
                placeholder="Masukkan Email"
                variant="outlined"
                color="primary"
                name="email"
                type="email"
                value={data.email}
                onChange={handleChange}
              />
              <Button
                type={!response.status ? "submit" : "button"}
                disabled={loading}
                onClick={() => {
                  if (response.status) {
                    navigate("/login");
                  }
                }}
                className="w-100 border-0 buttonSubmit btn-lg"
              >
                {loading ? (
                  <Spinner animation="border" variant="light" size="sm" />
                ) : (
                  <span>{!response.status ? "Kirim" : "Kembali"}</span>
                )}
              </Button>

              {response.status && (
                <Alert variant="success">{response.message}</Alert>
              )}
              {!response.status && response.message !== "" && (
                <Alert variant="danger">{response.message}</Alert>
              )}
            </Stack>
          </Form>
        </Card>
      </div>
    </Container>
  );
};
