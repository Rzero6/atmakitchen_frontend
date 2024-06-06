import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Stack, Spinner, Alert } from "react-bootstrap";
import { GetAllPresensi } from "../../../api/apiPresensi";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { GetAllTransaksi } from "../../../api/apiTransaksi";
import { GetAllPengeluaranLain } from "../../../api/apiPengeluaranLain";
import { GetAllPembelianBahanBaku } from "../../../api/apiPembelianBahanBaku";
import { GetAllPenitip } from "../../../api/apiPenitip";

const LaporanRekapPenitip = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transaksi, setTransaksi] = useState([]);
  const [penitip, setpPenitip] = useState([]);
  const [tanggal, setTanggal] = useState(dayjs());

  const handleChange = (date) => {
    setTanggal(date);
    fetchTransaksi();
    fetchPenitip();
  };
  const fetchTransaksi = () => {
    setIsLoading(true);
    GetAllTransaksi()
      .then((res) => {
        setTransaksi(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi kesalahan");
      })
      .finally(() => setIsLoading(false));
  };

  const fetchPenitip = () => {
    setIsLoading(true);
    GetAllPenitip()
      .then((res) => {
        setpPenitip(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi kesalahan");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTransaksi();
    fetchPenitip();
  }, []);

  // filter date
  const filteredTransaksi = transaksi.filter((item) => {
    const itemDate = dayjs(item.tanggal_penerimaan);
    return (
      itemDate.month() === tanggal.month() &&
      itemDate.year() === tanggal.year() &&
      item.status === "selesai"
    );
  });
  const filteredTransaksiOnlyProduk = filteredTransaksi.map((item) => ({
    ...item,
    detail: item.detail.filter(
      (detail) => detail.id_produk && detail.produk.id_penitip !== null
    ),
  }));
  //avoiding dupe here
  const renderedProductIds = new Set();

  //hitung total
  const totalQty = (id_produk) => {
    let total = 0;
    for (const transaksi of filteredTransaksiOnlyProduk) {
      for (const detail of transaksi.detail) {
        if (id_produk === detail.id_produk) {
          total += detail.jumlah;
        }
      }
    }
    return total;
  };
  const calculateTotal = (produkArray) => {
    let total = 0;
    produkArray.forEach((produk) => {
      const subTotal = totalQty(produk.id) * produk.harga;
      const diskon = (subTotal * 20) / 100;
      total += subTotal - diskon;
    });
    return total.toLocaleString("id-ID");
  };

  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Rekap Penitip</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-100" />
      </Stack>
      <div className="d-flex justify-content-center m-3">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={tanggal}
            label={"Pilih Bulan dan Tahun"}
            views={["month", "year"]}
            onChange={handleChange}
          />
        </LocalizationProvider>
      </div>
      {isLoading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        penitip.map((penitip) => (
          <div key={penitip.id} className="border border-1 p-3 m-3">
            <p className="customP text-decoration-underline">
              <strong>LAPORAN TRANSKRIP PENITIP</strong>
            </p>
            <p className="customP">ID Penitip: Penitip{penitip.id}</p>
            <p className="customP">Nama Penitip: {penitip.nama}</p>
            <p className="customP">Bulan: {tanggal.format("MMMM")}</p>
            <p className="customP">Tahun: {tanggal.format("YYYY")}</p>
            <p className="customP">
              Tanggal Cetak: {dayjs().format("DD MMMM YYYY")}
            </p>

            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Nama</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Harga Jual</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">20% Komisi</TableCell>
                    <TableCell align="right">Yang Diterima</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {penitip.produk.map((produk) => {
                    const subTotal = totalQty(produk.id) * produk.harga;
                    const komisi = (subTotal * 20) / 100;
                    const total = subTotal - komisi;

                    return (
                      <TableRow key={produk.id}>
                        <TableCell align="left">{produk.nama}</TableCell>
                        <TableCell align="right">
                          {totalQty(produk.id)}
                        </TableCell>
                        <TableCell align="right">
                          Rp. {produk.harga.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell align="right">
                          Rp. {subTotal.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell align="right">
                          Rp. {komisi.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell align="right">
                          Rp. {total.toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={5}>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="right">
                      Rp. <strong>{calculateTotal(penitip.produk)}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ))
      )}
    </Container>
  );
};

export default LaporanRekapPenitip;
