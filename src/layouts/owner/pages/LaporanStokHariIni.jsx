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

const LaporanStokHariIni = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tanggal, setTanggal] = useState(dayjs());
  const [bahanbaku, setBahanBaku] = useState([]);

  const handleChange = (date) => {
    setTanggal(date);
    fetchTransaksi();
  };
  const fetchBahanBaku = () => {
    setIsLoading(true);
    GetAllBahanBaku()
      .then((res) => {
        setBahanBaku(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi kesalahan");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBahanBaku();
  }, []);

  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">
          Stok Hari Ini
        </h1>
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
        <>
          <div className="border border-1 p-3 m-3">
            <p className="customP text-decoration-underline">
              <strong>LAPORAN Stok Bahan Baku</strong>
            </p>
            <p className="customP">
              Tanggal Cetak: {dayjs().format("DD MMMM YYYY")}
            </p>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="left">Nama Bahan</TableCell>
                    <TableCell align="right">Satuan</TableCell>
                    <TableCell align="right">Stok</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bahanbaku.map((bahanBaku) => (
                    <TableRow key={bahanBaku.id}>
                      <TableCell></TableCell>
                      <TableCell align="left">{bahanBaku.nama}</TableCell>
                      <TableCell align="right">{bahanBaku.satuan}</TableCell>
                      <TableCell align="right">
                        {bahanBaku.stok.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </Container>
  );
};

export default LaporanStokHariIni;
