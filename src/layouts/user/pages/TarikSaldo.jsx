import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { GetCustomerById } from "../../../api/apiCustomer";
import { toast } from "react-toastify";
import { Col, Container, Row, Button } from "react-bootstrap";
import {
  Box,
  CircularProgress,
  Divider,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
} from "@mui/material";
import { MoneyFormat } from "../../../components/NumericFormat";
import {
  CreateHistoriSaldo,
  GetAllHistoriSaldo,
} from "../../../api/apiHistoriSaldo";
import dayjs from "dayjs";

const PenarikanSaldo = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [isLoading, setLoading] = useState(true);
  const [isLoadingTab, setLoadingTab] = useState(true);
  const [isPending, setPending] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [histori, setHistori] = useState([]);
  const [data, setData] = useState({
    mutasi: "",
    tujuan: "",
  });
  const handleTextChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const fetchCustomer = () => {
    setLoading(true);
    GetCustomerById(user.id)
      .then((res) => setCustomer(res))
      .catch((err) => {
        console.log(err);
        toast.error("Uh ohh, terjadi kesalahan.");
      })
      .finally(() => setLoading(false));
  };
  const fetchHistori = () => {
    setLoadingTab(true);
    GetAllHistoriSaldo()
      .then((res) => setHistori(res))
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi masalah");
      })
      .finally(() => setLoadingTab(false));
  };
  useEffect(() => {
    fetchCustomer();
    fetchHistori();
  }, []);

  const handleWithdraw = (event) => {
    event.preventDefault();
    setPending(true);
    const formData = new FormData();
    formData.append("id_customer", customer.id);
    formData.append("mutasi", -data.mutasi);
    formData.append("tujuan", data.tujuan);
    CreateHistoriSaldo(formData)
      .then((res) => {
        toast.success("Berhasil, tunggu konfirmasinya");
        setData({ mutasi: "", tujuan: "" });
        fetchHistori();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi masalah");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Container>
      {isLoading ? (
        <div
          style={{ width: "100%", height: "80vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <h1>Penarikan Saldo</h1>
          <p>
            {" "}
            <strong>{user.nama}</strong>
          </p>
          <p>Saldo: Rp. {customer.saldo.toLocaleString("id-ID")}</p>
          <Row className="mb-2">
            <Col>
              <TextField
                label="Jumlah"
                name="mutasi"
                variant="outlined"
                value={data.mutasi}
                onChange={handleTextChange}
                fullWidth
                margin="normal"
                InputProps={{ inputComponent: MoneyFormat }}
              />
            </Col>
            <Col>
              <TextField
                name="tujuan"
                label="Tujuan"
                variant="outlined"
                value={data.tujuan}
                onChange={handleTextChange}
                fullWidth
                margin="normal"
              />
            </Col>
          </Row>
          <Button
            className="w-100"
            variant="primary"
            color="primary"
            onClick={handleWithdraw}
            disabled={
              isPending ||
              isLoading ||
              data.tujuan.trim() === "" ||
              data.mutasi <= 0 ||
              data.mutasi > customer.saldo
            }
          >
            Kirim Permintaan Tarik Saldo
          </Button>
          <TabHistori
            histori={histori}
            idCustomer={customer.id}
            isLoading={isLoadingTab}
          />
        </>
      )}
    </Container>
  );
};

const TabHistori = ({ histori, idCustomer, isLoading }) => {
  const historiSelesai = histori.filter(
    (item) => item.status === 1 && item.id_customer === idCustomer
  );
  const historiMenunggu = histori.filter(
    (item) => item.status !== 1 && item.id_customer === idCustomer
  );
  const [value, setValue] = useState(0);

  const TabPanel = ({ children, value, index }) => {
    return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
  };
  return (
    <>
      {isLoading ? (
        <div
          style={{ width: "100%", height: "50vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              aria-label="basic tabs example"
            >
              <Tab label="Selesai" />
              <Tab label="Menunggu" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {historiSelesai <= 0 ? (
              <>Belum ada penarikan saldo</>
            ) : (
              historiSelesai.map((item, index) => (
                <>
                  <ListItem
                    key={index}
                    style={{
                      backgroundColor:
                        item.bukti_transfer === "ditolak"
                          ? "rgba(255, 0, 0, 0.2)"
                          : "transparent",
                    }}
                  >
                    <ListItemText
                      primary={item.tujuan}
                      secondary={dayjs(item.updated_at).format(
                        "HH:mm, DD MMMM YYYY"
                      )}
                    />
                    <ListItemText
                      className={`${
                        item.mutasi <= 0 && item.bukti_transfer !== "ditolak"
                          ? "text-danger"
                          : "text-dark"
                      } text-end`}
                      primary={`${item.mutasi < 0 ? "-" : "+"} Rp. ${Math.abs(
                        item.mutasi
                      ).toLocaleString("id-ID")}`}
                      secondary={
                        item.bukti_transfer === "ditolak" && item.bukti_transfer
                      }
                    />
                  </ListItem>
                  <Divider sx={{ borderWidth: 1 }} />
                </>
              ))
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {historiMenunggu <= 0 ? (
              <>Belum ada penarikan saldo</>
            ) : (
              historiMenunggu.map((item, index) => (
                <>
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.tujuan}
                      secondary={dayjs(item.updated_at).format(
                        "HH:mm, DD MMMM YYYY"
                      )}
                    />
                    <ListItemText
                      className={`${
                        item.mutasi <= 0 ? "text-danger" : "text-success"
                      } text-end`}
                      primary={`${item.mutasi < 0 ? "-" : "+"} Rp. ${Math.abs(
                        item.mutasi
                      ).toLocaleString("id-ID")}`}
                    />
                  </ListItem>
                  <Divider sx={{ borderWidth: 1 }} />
                </>
              ))
            )}
          </TabPanel>
        </>
      )}
    </>
  );
};
export default PenarikanSaldo;
