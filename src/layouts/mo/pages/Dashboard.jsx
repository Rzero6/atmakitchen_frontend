import React from "react";
import { useState, useEffect } from "react";
import { Container, Stack, Spinner } from "react-bootstrap";
import { GetAllTransaksi } from "../../../api/apiTransaksi";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ListPesananHarian from "./ListPesananHarian";
import KonfirmasiPesanan from "./KonfirmasiPesanan";
import dayjs from "dayjs";

const DashboardMO = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transaksi, setTransaksi] = useState([]);
  const [tab, setTab] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };
  const fetchTransaksi = () => {
    setIsLoading(true);
    GetAllTransaksi()
      .then((response) => {
        setTransaksi(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchTransaksi();
  }, []);
  const TabPanel = ({ children, value, index }) => {
    return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
  };
  const checkHargaKirim = (jarak) => {
    if (jarak <= 0) {
      return 0;
    }
    if (jarak <= 5) {
      return 10000;
    } else if (jarak > 5 && jarak <= 10) {
      return 15000;
    } else if (jarak > 10 && jarak <= 15) {
      return 20000;
    } else {
      return 25000;
    }
  };
  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Dashboard</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-100" />
      </Stack>
      {isLoading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab label="Pesanan Masuk" />
              <Tab label="List Pesanan Harian" />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <KonfirmasiPesanan
              transaksi={transaksi.filter(
                (transaksi) => transaksi.status === "pembayaran valid"
              )}
              fetchTransaksi={fetchTransaksi}
              checkHargaKirim={checkHargaKirim}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <ListPesananHarian
              transaksi={transaksi.filter(
                (transaksi) =>
                  dayjs(transaksi.tanggal_penerimaan).format("YYYY-MM-DD") ===
                  dayjs().add(1, "day").format("YYYY-MM-DD")
              )}
            />
          </TabPanel>
        </Box>
      )}
    </Container>
  );
};

export default DashboardMO;
