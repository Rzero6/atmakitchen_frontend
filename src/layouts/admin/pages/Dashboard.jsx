import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Stack, Spinner, Alert, Row } from "react-bootstrap";
import { GetAllTransaksi } from "../../../api/apiTransaksi";
import { Box, Tabs, Tab } from "@mui/material";
import CheckPembayaran from "./ListTransaksi/CheckPembayaran";
import CheckJarak from "./ListTransaksi/CheckJarak";
import SiapPickUp from "./ListTransaksi/SiapPickup";

const DashboardAdmin = () => {
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
  return (
    <Container className="p-5">
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
        <Box className="p-3" sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab label="Konfirmasi Jarak" />
              <Tab label="Konfirmasi Pembayaran" />
              <Tab label="Siap Pick-Up" />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <CheckJarak
              transaksi={transaksi.filter(
                (transaksi) =>
                  transaksi.status === "belum dijarak" &&
                  transaksi.id_alamat !== null
              )}
              fetchTransaksi={fetchTransaksi}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <CheckPembayaran
              transaksi={transaksi.filter(
                (transaksi) => transaksi.status === "sudah dibayar"
              )}
              fetchTransaksi={fetchTransaksi}
            />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <SiapPickUp
              transaksi={transaksi.filter(
                (transaksi) => transaksi.status === "diproses"
              )}
              fetchTransaksi={fetchTransaksi}
            />
          </TabPanel>
        </Box>
      )}
    </Container>
  );
};

export default DashboardAdmin;
