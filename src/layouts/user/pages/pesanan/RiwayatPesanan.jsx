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
import dayjs from "dayjs";
import "dayjs/locale/en";

const RiwayatPesanan = ({ transaksi, getStatusColor }) => {
  const [isPending, setIsPending] = useState(false);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransaksi = transaksi.filter((atransaksi) => {
    const queryTerms = searchQuery
      .toLowerCase()
      .split(" ")
      .filter((term) => term.trim() !== "");

    if (
      atransaksi.status !== "selesai" &&
      atransaksi.status !== "dibatalkan" &&
      atransaksi.status !== "ditolak"
    ) {
      return false;
    }

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

  return (
    <Container className="p-4">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Riwayat Pesanan</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-100" />
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
            style={{
              width: "100%",
              height: "50%",
              backgroundColor: getStatusColor(atransaksi.status),
            }}
          >
            <div className="d-flex justify-content-between">
              <p>
                {dayjs(atransaksi.tanggal_penerimaan)
                  .locale("en")
                  .format("dddd, DD MMM YYYY")}
              </p>
              <p>
                <strong>
                  {atransaksi.status.replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  )}
                </strong>
              </p>
            </div>
            {atransaksi.id_alamat === null ? (
              <p className="customP">Pick-up</p>
            ) : (
              <p className="customP">
                Alamat : {atransaksi.alamat.jalan}, {atransaksi.alamat.kota}
              </p>
            )}
            <p className="customP">
              Barang yang dibeli:{" "}
              {atransaksi.detail.map((adetail, index2) => (
                <span key={index2}>
                  {adetail.produk
                    ? adetail.jumlah +
                      " " +
                      adetail.produk.nama +
                      " " +
                      adetail.produk.ukuran
                    : adetail.jumlah + " " + adetail.hampers.nama}
                  {index2 !== atransaksi.detail.length - 1 && ", "}
                </span>
              ))}
            </p>
            <p className="customP">
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
