import React, { useState } from "react";
import { json, useNavigate } from "react-router-dom";
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
import {
  TextField,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { UpdatePassword } from "../api/apiUserAuth";

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [data, setData] = useState({ password: "", confPassword: "" });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ status: null, message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const changePassword = (event) => {
    event.preventDefault();
    setLoading(true);
    UpdatePassword(user, data)
      .then((res) => {
        setResponse(res);
        setData({ password: "", confPassword: "" });
        toast.success(res.message);
      })
      .catch((err) => {
        setResponse(err);
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  return (
    <Container style={{ height: "100vh", width: "100%" }}>
      <div className="content">
        <Card className="p-5">
          <Form onSubmit={changePassword}>
            <Stack gap={3}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password1">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password1"
                  placeholder="Masukkan Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  autoComplete="off"
                  value={data.password}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password2">
                  Konfirmasi Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password2"
                  placeholder="Masukkan Password"
                  name="confPassword"
                  type={showPassword2 ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword2((show) => !show)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword2 ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Konfirmasi Password"
                  autoComplete="off"
                  value={data.confPassword}
                  onChange={handleChange}
                />
              </FormControl>
              <Button
                disabled={
                  data.password === "" ||
                  data.confPassword === "" ||
                  data.password !== data.confPassword
                }
                type="submit"
                className="w-100 border-0 buttonSubmit btn-lg"
              >
                {loading ? (
                  <Spinner animation="border" variant="light" size="sm" />
                ) : (
                  <span>Ubah</span>
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
