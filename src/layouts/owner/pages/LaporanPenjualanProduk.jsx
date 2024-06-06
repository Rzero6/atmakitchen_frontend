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
import { BarChart } from "@mui/x-charts";
import { GetAllBahanBaku } from "../../../api/apiBahanBaku";
import { GetAllProduk } from "../../../api/apiProduk";
import { GetAllHampers } from "../../../api/apiHampers";

const LaporanPenjualanProduk = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tanggal, setTanggal] = useState(dayjs());
  const [transaksi, setTransaksi] = useState([]);
  const [produk, setProduk] = useState([]);
  const [hampers, setHampers] = useState([]);

  const handleChange = (date) => {
    setTanggal(date);
    fetchTransaksi();
    fetchProduk();
    fetchHampers();
  };
  const fetchProduk = () => {
    setIsLoading(true);
    GetAllProduk()
      .then((res) => {
        setProduk(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi kesalahan");
      })
      .finally(() => setIsLoading(false));
  };
  const fetchHampers = () => {
    setIsLoading(true);
    GetAllHampers()
      .then((res) => {
        setHampers(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi kesalahan");
      })
      .finally(() => setIsLoading(false));
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
  // filter date
  const filteredTransaksi = transaksi.filter((item) => {
    const itemDate = dayjs(item.tanggal_penerimaan);
    return (
      itemDate.year() === tanggal.year() &&
      itemDate.month() === tanggal.month() &&
      item.status === "selesai"
    );
  });
  //hitung total
  const totalQtyProduk = (id_produk) => {
    let total = 0;
    for (const transaksi of filteredTransaksi) {
      for (const detail of transaksi.detail) {
        if (detail.id_produk === id_produk) {
          total += detail.jumlah;
        }
      }
    }
    return total;
  };
  const totalQtyHampers = (id_hampers) => {
    let total = 0;
    for (const transaksi of filteredTransaksi) {
      for (const detail of transaksi.detail) {
        if (detail.id_hampers === id_hampers) {
          total += detail.jumlah;
        }
      }
    }
    return total;
  };
  const totalAll = () => {
    let total = 0;
    for (const transaksi of filteredTransaksi) {
      for (const detail of transaksi.detail) {
        if (detail.id_hampers !== null) {
          total += detail.jumlah * detail.hampers.harga;
        }
        if (detail.id_produk !== null) {
          total += detail.jumlah * detail.produk.harga;
        }
      }
    }
    return total;
  };
  useEffect(() => {
    fetchTransaksi();
    fetchProduk();
    fetchHampers();
  }, []);

  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">
          Penjualan Produk Bulanan
        </h1>
        <hr className="border-top border-dark border-3 opacity-100 w-100" />
      </Stack>
      <div className="d-flex justify-content-center">
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
        <>
          <div className="border border-1 p-3 m-3">
            <p className="customP text-decoration-underline">
              <strong>LAPORAN Penjualan Produk</strong>
            </p>
            <p className="customP">Bulan: {tanggal.format("MMMM")}</p>
            <p className="customP">Tahun: {tanggal.format("YYYY")}</p>
            <p className="customP">
              Tanggal Cetak: {dayjs().format("DD MMMM YYYY")}
            </p>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Produk</TableCell>
                    <TableCell align="right">Kuantitas</TableCell>
                    <TableCell align="right">Harga</TableCell>
                    <TableCell align="right">Jumlah Uang</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {produk.map((produk) => (
                    <TableRow key={produk.id}>
                      <TableCell>{produk.nama}</TableCell>
                      <TableCell align="right">
                        {totalQtyProduk(produk.id)}
                      </TableCell>
                      <TableCell align="right">
                        Rp. {produk.harga.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell align="right">
                        Rp.{" "}
                        {(
                          totalQtyProduk(produk.id) * produk.harga
                        ).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                  {hampers.map((hampers) => (
                    <TableRow key={hampers.id}>
                      <TableCell>{hampers.nama}</TableCell>
                      <TableCell align="right">
                        {totalQtyProduk(hampers.id)}
                      </TableCell>
                      <TableCell align="right">
                        Rp. {hampers.harga.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell align="right">
                        Rp.{" "}
                        {(
                          totalQtyProduk(hampers.id) * hampers.harga
                        ).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Rp. {totalAll().toLocaleString('id-ID')}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </Container>
  );
};

export default LaporanPenjualanProduk;
