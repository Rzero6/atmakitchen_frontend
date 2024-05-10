import { useState, useEffect } from "react";
import { Button, Alert, Spinner, Form, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { PhoneNumberFormat } from "../NumericFormat";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { SignUp } from "../../api/apiUserAuth";

const FormRegister = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState({
    nama: "",
    email: "",
    password: "",
    tanggal_lahir: dayjs().subtract(18, "year").format("YYYY-MM-DD"),
    no_telepon: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    const newData = { ...data, [event.target.name]: event.target.value };
    setData(newData);
    if (
      newData.email.trim().length > 0 &&
      newData.password.length > 7 &&
      newData.no_telepon.length > 8
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };
  //Using Axios
  const Register = (event) => {
    event.preventDefault();
    console.log(data);
    setLoading(true);
    SignUp(data)
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        console.log(err);
        if (err.message.email[0]) toast.error(err.message.email[0]);
        else toast.error(err.message);
      })
      .finally((res) => {
        setResponse(res);
        setLoading(false);
      });
  };

  //Using Axios
  return (
    <Form
      style={{ maxWidth: "800px", margin: "auto" }}
      className="p-4"
      onSubmit={Register}
    >
      <Stack direction="vertical" gap={3}>
        <Alert variant="primary" className="mb-3 alertColor">
          <p className="mb-0 lead">
            <strong>Atma Kitchen</strong> registrasi
          </p>
          <p className="mb-0">
            Isi nama minimal 3 huruf dan password minimal 8 huruf{" "}
          </p>
        </Alert>
        <TextField
          label="Nama"
          placeholder="Masukkan Nama"
          variant="outlined"
          color="primary"
          name="nama"
          type="text"
          value={data.nama}
          onChange={handleChange}
        />
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
        <TextField
          label="No Telepon"
          placeholder="Masukkan Nomor Telepon"
          variant="outlined"
          color="primary"
          name="no_telepon"
          type="text"
          value={data.no_telepon}
          onChange={handleChange}
          InputProps={{ inputComponent: PhoneNumberFormat }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            disableFuture
            maxDate={dayjs().subtract(18, "year")}
            label="Tanggal Lahir"
            name="tanggal_lahir"
            onChange={(newValue) => {
              const formattedDate = newValue.format("YYYY-MM-DD");
              setData({
                ...data,
                tanggal_lahir: formattedDate,
              });
            }}
            value={dayjs(data.tanggal_lahir)}
            className="w-100"
          />
        </LocalizationProvider>
        <Button
          type="submit"
          disabled={isDisabled || loading}
          className="w-100 border-0 buttonSubmit btn-lg"
        >
          {loading ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            <span>Register</span>
          )}
        </Button>

        {response && response.status ? (
          <Alert variant="success">{response.message}</Alert>
        ) : response && response.message ? (
          <Alert variant="danger">{response.message}</Alert>
        ) : null}
      </Stack>
    </Form>
  );
};
export default FormRegister;
