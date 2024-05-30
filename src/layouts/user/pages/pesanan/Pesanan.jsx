import React from "react";
import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import RiwayatPesanan from "./RiwayatPesanan";
import { Spinner } from "react-bootstrap";
import { GetTransaksiByUserId } from "../../../../api/apiTransaksi";
import BerlangsungPesanan from "./BerlangsungPesanan";

const PesananTabs = () => {
  const [tab, setTab] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [transaksi, setTransaksi] = useState([]);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [customer, setCustomer] = useState(
    JSON.parse(sessionStorage.getItem("customer"))
  );

  const fetchTransaksi = () => {
    setIsPending(true);
    GetTransaksiByUserId(user.id)
      .then((response) => {
        setTransaksi(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);
  const TabPanel = ({ children, value, index }) => {
    return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "ditolak":
      case "belum dibayar":
        return "#F8EED7";
      case "siap di-pickup":
      case "sedang dikirim kurir":
      case "selesai":
        return "#d4edda";
      case "batal":
        return "#f5c6cb";
      case "sudah dibayar":
      case "dikembalikan":
      case "diproses":
        return "#cce5ff";
      default:
        return "#ffffff";
    }
  };
  return (
    <>
      {isPending ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
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
              <Tab label="Berlangsung" />
              <Tab label="Riwayat" />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <BerlangsungPesanan
              transaksi={transaksi}
              getStatusColor={getStatusColor}
              fetchTransaksi={fetchTransaksi}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <RiwayatPesanan
              transaksi={transaksi}
              getStatusColor={getStatusColor}
            />
          </TabPanel>
        </Box>
      )}
    </>
  );
};

export default PesananTabs;
