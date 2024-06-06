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

const LaporanPresensidanGaji = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [presensi, setPresensi] = useState([]);
  const [tanggal, setTanggal] = useState(dayjs());

  const handleChange = (date) => {
    setTanggal(date);
    fetchPresensi();
  };
  const fetchPresensi = () => {
    setIsLoading(true);
    GetAllPresensi()
      .then((res) => {
        setPresensi(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi kesalahan");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPresensi();
  }, []);
  // filter date
  const filteredPresensi = presensi.filter((item) => {
    const itemDate = dayjs(item.tanggal);
    return (
      itemDate.month() === tanggal.month() && itemDate.year() === tanggal.year()
    );
  });
  // filter unique karyawan
  const uniqueKaryawanIds = new Set();
  const uniqueFilteredPresensi = filteredPresensi.filter((item) => {
    if (!uniqueKaryawanIds.has(item.id_karyawan)) {
      uniqueKaryawanIds.add(item.id_karyawan);
      return true;
    }
    return false;
  });
  const countHadir = (id_karyawan) => {
    let count = 0;
    for (const item of filteredPresensi) {
      if (id_karyawan === item.id_karyawan && item.kehadiran) count++;
    }
    return count;
  };
  const countBolos = (id_karyawan) => {
    let count = 0;
    for (const item of filteredPresensi) {
      if (id_karyawan === item.id_karyawan && !item.kehadiran) count++;
    }
    return count;
  };
  const countTotal = () => {
    let total = 0;
    for (const item of uniqueFilteredPresensi) {
      total +=
        countHadir(item.id_karyawan) * item.karyawan.gaji_harian +
        (countBolos(item.id_karyawan) > 3 ? 0 : item.karyawan.bonus);
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
          Presensi dan Gaji Bulanan
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
      ) : filteredPresensi.length > 0 ? (
        <div className="border border-1 p-3 m-3">
          <p className="customP text-decoration-underline">
            <strong>LAPORAN Presensi Karyawan</strong>
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
                  <TableCell>Nama</TableCell>
                  <TableCell align="right">Jumlah Hadir</TableCell>
                  <TableCell align="right">Jumlah Bolos</TableCell>
                  <TableCell align="right">Honor Harian</TableCell>
                  <TableCell align="right">Bonus Rajin</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uniqueFilteredPresensi.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell component="th" scope="row">
                      {item.karyawan.user.nama}
                    </TableCell>
                    <TableCell align="right">
                      {countHadir(item.id_karyawan)}
                    </TableCell>
                    <TableCell align="right">
                      {countBolos(item.id_karyawan)}
                    </TableCell>
                    {/* You need to calculate the values for 'Honor Harian', 'Bonus Rajin', and 'Total' based on your logic */}
                    <TableCell align="right">
                      Rp.
                      {(
                        countHadir(item.id_karyawan) * item.karyawan.gaji_harian
                      ).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell align="right">
                      Rp.
                      {countBolos(item.id_karyawan) > 3
                        ? 0
                        : item.karyawan.bonus.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell align="right">
                      Rp.
                      {(
                        countHadir(item.id_karyawan) *
                          item.karyawan.gaji_harian +
                        (countBolos(item.id_karyawan) > 3
                          ? 0
                          : item.karyawan.bonus)
                      ).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5}>
                    <strong> Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Rp.{countTotal().toLocaleString("id-ID")}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <Alert variant="secondary" className="mt-3 text-center">
            Belum ada Data....
          </Alert>
        </div>
      )}
    </Container>
  );
};

export default LaporanPresensidanGaji;
