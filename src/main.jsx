import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
