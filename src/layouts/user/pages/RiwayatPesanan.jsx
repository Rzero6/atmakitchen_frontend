import React from "react";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Container,
  Stack,
  Button,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  TextField,
  Divider,
  Avatar,
  Card,
  Badge,
  Typography,
  Skeleton,
} from "@mui/material";
import { getProfilPic } from "../../../api";
import { MdOutlineEdit } from "react-icons/md";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { GoVerified, GoUnverified } from "react-icons/go";
import { validate } from "react-email-validator";
import { GetTransaksiByUserId } from "../../../api/apiTransaksi";

const RiwayatPesanan = () => {
  const [isPending, setIsPending] = useState(false);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [customer, setCustomer] = useState(
    JSON.parse(sessionStorage.getItem("customer"))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [transaksi, setTransaksi] = useState([]);
  const fetchTransaksi = () => {
    setIsPending(true);
    GetTransaksiByUserId(user.id)
      .then((response) => {
        const filteredTransaksi = response.filter(
          (transaksi) => transaksi.status === "selesai"
        );
        setTransaksi(filteredTransaksi);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const filteredTransaksi = transaksi.filter((atransaksi) => {
    const queryTerms = searchQuery
      .toLowerCase()
      .split(" ")
      .filter((term) => term.trim() !== "");
    return queryTerms.every((queryTerm) => {
      return atransaksi.detail.some((adetail) => {
        const productName = adetail.produk
          ? adetail.produk.nama.toLowerCase()
          : "";
        const hamperName = adetail.hampers
          ? adetail.hampers.nama.toLowerCase()
          : "";
        return (
          productName.includes(queryTerm) || hamperName.includes(queryTerm)
        );
      });
    });
  });

  useEffect(() => {
    fetchTransaksi();
  }, []);
  return (
    <Container className="p-4">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Riwayat Pesanan</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-50" />
      </Stack>
      <TextField
        label="Search"
        variant="outlined"
        color="primary"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", width: "100%" }}
      />
      {isPending ? (
        <Skeleton animation="wave" variant="rounded" height={200} />
      ) : transaksi?.length > 0 ? (
        filteredTransaksi.map((atransaksi, index) => (
          <Card
            key={index}
            className="p-4 mb-4"
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
                  {adetail.produk ? adetail.produk.nama : adetail.hampers.nama}
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
          <Alert>Belum ada riwayat pesanan, ayo pesan dulu</Alert>
        </>
      )}
    </Container>
  );
};

export default RiwayatPesanan;
