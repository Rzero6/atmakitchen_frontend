import { useState, useEffect } from "react";
import { Button, Alert, Spinner, Form, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SignIn } from "../../api/apiAdminAuth";
import { GetAllRole } from "../../api/apiRole";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const FormLogin = () => {
  const navigate = useNavigate();
  const [failedAttempt, setFailedAttempt] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    const newData = { ...data, [event.target.name]: event.target.value };
    setData(newData);
    if (newData.email.trim().length > 0 && newData.password.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };
  const fetchRoles = () => {
    GetAllRole()
      .then((response) => {
        setRoles(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchRoles();
  }, []);
  //Using Axios
  const Login = (event) => {
    event.preventDefault();
    setLoading(true);
    SignIn(data)
      .then((res) => {
        const userRole = roles.find((role) => role.id === res.user.id_role);
        sessionStorage.setItem("token", res.access_token);
        sessionStorage.setItem("user", JSON.stringify(res.user));
        sessionStorage.setItem("role", userRole.nama);
        if (userRole.nama === "Customer") navigate("/");
        else if (userRole.nama === "Owner") navigate("/owner");
        else if (userRole.nama === "Manager Operasional") navigate("/mo");
        else if (userRole.nama === "Admin") navigate("/admin");
        else {
          toast.error("unauthorized");
          return;
        }
        toast.success(res.message);
      })
      .catch((err) => {
        console.log(err);
        setFailedAttempt(true);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //Using Axios
  return (
    <Form
      style={{ maxWidth: "800px", margin: "auto" }}
      className="p-4"
      onSubmit={Login}
    >
      <Stack direction="vertical" gap={3}>
        <Alert variant="primary" className="mb-3 alertColor">
          <p className="mb-0 lead">
            <strong>Atma Kitchen</strong> mantaaapss
          </p>
          <p className="mb-0">
            Selamat datang di website kami silahkan login...
          </p>
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
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            placeholder="Masukkan Password"
            name="password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
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
        {failedAttempt ? (
          <Alert variant="danger" className="alertColor">
            <p className="mb-0 lead">
              <strong>Password atau Email Salah</strong>
            </p>
            <p className="m-0">
              <Link to="/password/reset" style={{ color: "black" }}>
                aduh lupa password
              </Link>
            </p>
          </Alert>
        ) : (
          <div className="text-end">
            <Link to="/password/reset">lupa password ?</Link>
          </div>
        )}

        <Button
          type="submit"
          disabled={isDisabled || loading}
          className="w-100 border-0 buttonSubmit btn-lg"
        >
          {loading ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            <span>Login</span>
          )}
        </Button>
        <Button className="btn-lg">Register</Button>
      </Stack>
    </Form>
  );
};
export default FormLogin;
