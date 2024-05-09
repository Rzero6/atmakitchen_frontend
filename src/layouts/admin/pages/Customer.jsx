import React from "react";
import { useState, useEffect } from "react";
import {
  Alert,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Stack,
  Spinner,
  FormControl,
  Card,
} from "react-bootstrap";
import Paper from "@mui/material/Paper";
import { GetAllCustomer } from "../../../api/apiCustomer";
import CustomTable from "../../../components/CustomTable";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { GetTransaksiByUserId } from "../../../api/apiTransaksi";
export const tableHeader = [
  { id: "nama", label: "Nama", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  {
    id: "tanggal_lahir",
    label: "Tanggal Lahir",
    minWidth: 100,
  },
  {
    id: "no_telepon",
    label: "Nomor Telepon",
    minWidth: 100,
    format: (value) => {
      let formattedValue = value.replace(/(.{4})/g, "$1-");
      if (formattedValue.endsWith("-")) {
        formattedValue = formattedValue.slice(0, -1);
      }
      return formattedValue;
    },
  },
];

const Customer = () => {
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [data, setData] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [transaksi, setTransaksi] = useState([]);

  const handleRowClick = (row) => {
    fetchTransaksi(row.id_user);
    handleShowModal();
  };
  const handleShowModal = () => {
    setShowHistory(true);
  };
  const handleCloseModal = () => {
    setShowHistory(false);
  };
  const fetchCustomer = () => {
    setIsLoading(true);
    GetAllCustomer()
      .then((response) => {
        const formattedResponse = response.map((item) => ({
          ...item,
          tanggal_lahir: dayjs(item.tanggal_lahir).format("DD MMM YYYY"),
        }));
        setCustomer(formattedResponse);
      })
      .catch((err) => {
        toast.error(JSON.stringify(err.message));
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };
  const fetchTransaksi = (id) => {
    setIsPending(true);
    GetTransaksiByUserId(id)
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

  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Pelanggan</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-50" />
      </Stack>
      {isLoading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : customer?.length > 0 ? (
        <Row className="justify-content-center align-items-center">
          <CustomTable
            tableHeader={tableHeader}
            data={customer}
            handleRowClick={handleRowClick}
          />
        </Row>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <Alert variant="secondary" className="mt-3 text-center">
            Belum ada Customer....
          </Alert>
        </div>
      )}

      <Modal centered show={showHistory} onHide={handleCloseModal} scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Riwayat Pesanan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isPending ? (
            <div className="d-flex align-items-center justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : transaksi?.length > 0 ? (
            transaksi.map((atransaksi, index) => (
              <Card
                key={index}
                className="p-4"
                style={{ width: "100%", height: "50%" }}
              >
                <p>
                  {dayjs(atransaksi.tanggal_penerimaan)
                    .locale("en")
                    .format("dddd, DD MMM YYYY")}
                </p>
                <p>
                  Alamat : {atransaksi.alamat.jalan}, {atransaksi.alamat.kota}
                </p>
                <p>
                  Barang yang dibeli:
                  {atransaksi.detail.map((adetail, index2) => (
                    <span key={index2}>
                      {adetail.produk
                        ? adetail.produk.nama
                        : adetail.hampers.nama}
                      {index2 !== atransaksi.detail.length - 1 && ", "}
                    </span>
                  ))}
                </p>
                <p>
                  Total Pembayaran:{" "}
                  {atransaksi.detail.reduce((total, adetail) => {
                    const hargaProduk = adetail.produk
                      ? adetail.produk.harga * adetail.jumlah
                      : 0;
                    const hargaHampers = adetail.hampers
                      ? adetail.hampers.harga * adetail.jumlah
                      : 0;
                    return total + hargaProduk + hargaHampers;
                  }, 0) + atransaksi.tip}
                </p>
              </Card>
            ))
          ) : (
            <>
              <Alert>Belum ada riwayat pesanan</Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Customer;
