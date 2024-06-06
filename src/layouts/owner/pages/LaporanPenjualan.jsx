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
const monthsData = [];

for (let i = 1; i <= 12; i++) {
  const monthObject = dayjs().month(i - 1);
  monthsData.push(monthObject);
}

const LaporanPenjualan = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transaksi, setTransaksi] = useState([]);
  const [tanggal, setTanggal] = useState(dayjs());

  const handleChange = (date) => {
    setTanggal(date);
    fetchTransaksi();
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

  useEffect(() => {
    fetchTransaksi();
  }, []);

  // filter date
  const filteredTransaksi = transaksi.filter((item) => {
    const itemDate = dayjs(item.tanggal_penerimaan);
    return itemDate.year() === tanggal.year() && item.status === "selesai";
  });
  //hitung total
  const totalTransaksi = (month) => {
    let total = 0;
    for (const item of filteredTransaksi) {
      if (dayjs(item.tanggal_penerimaan).isSame(dayjs(month), "month")) {
        total++;
      }
    }
    return total;
  };
  const totalPemasukan = (month) => {
    let total = 0;
    for (const item of filteredTransaksi) {
      if (dayjs(item.tanggal_penerimaan).isSame(dayjs(month), "month"))
        total += item.total_harga + item.tip;
    }
    return total;
  };
  const totalAll = () => {
    let total = 0;
    for (const item of filteredTransaksi) {
      total += item.total_harga + item.tip;
    }
    return total;
  };
  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">
          Penjualan Tahunan
        </h1>
        <hr className="border-top border-dark border-3 opacity-100 w-100" />
      </Stack>
      <div className="d-flex justify-content-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={tanggal}
            label={"Pilih Bulan dan Tahun"}
            views={["year"]}
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
          <div className="border border-1 p-3 m-3 d-flex justify-content-center">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: monthsData.map((month) => month.format("MMMM")),
                },
              ]}
              series={[
                { data: monthsData.map((month) => totalPemasukan(month)) },
              ]}
              height={500}
              width={1000}
            />
          </div>
          <div className="border border-1 p-3 m-3">
            <p className="customP text-decoration-underline">
              <strong>LAPORAN Penjualan Bulanan</strong>
            </p>
            <p className="customP">Tahun: {tanggal.format("YYYY")}</p>
            <p className="customP">
              Tanggal Cetak: {dayjs().format("DD MMMM YYYY")}
            </p>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="left">Bulan</TableCell>
                    <TableCell align="right">Jumlah Transaksi</TableCell>
                    <TableCell align="right">Jumlah Uang</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthsData.map((monthData, index) => (
                    <TableRow key={index}>
                      <TableCell></TableCell>
                      <TableCell align="left">
                        {monthData.format("MMMM")}
                      </TableCell>
                      <TableCell align="right">
                        {totalTransaksi(monthData)}
                      </TableCell>
                      <TableCell align="right">
                        Rp. {totalPemasukan(monthData).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <strong>Total</strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>Rp. {totalAll().toLocaleString("id-ID")}</strong>
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

export default LaporanPenjualan;
