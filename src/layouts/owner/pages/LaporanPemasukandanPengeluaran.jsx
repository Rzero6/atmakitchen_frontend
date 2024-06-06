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

const LaporanPemasukandanPengeluaran = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [presensi, setPresensi] = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [pengeluaranLain, setPengeluaranLain] = useState([]);
  const [pengeluaranBahanBaku, setPengeluaranBahanBaku] = useState([]);
  const [tanggal, setTanggal] = useState(dayjs());

  const handleChange = (date) => {
    setTanggal(date);
    fetchTransaksi();
    fetchPengeluaranBahanBaku();
    fetchPengeluaranLain();
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
  const fetchPengeluaranLain = () => {
    setIsLoading(true);
    GetAllPengeluaranLain()
      .then((res) => {
        setPengeluaranLain(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi kesalahan");
      })
      .finally(() => setIsLoading(false));
  };
  const fetchPengeluaranBahanBaku = () => {
    setIsLoading(true);
    GetAllPembelianBahanBaku()
      .then((res) => {
        setPengeluaranBahanBaku(res);
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

  useEffect(() => {
    fetchTransaksi();
    fetchPengeluaranBahanBaku();
    fetchPengeluaranLain();
    fetchPresensi();
  }, []);
  /// Gaji
  // filter unique karyawan
  const filteredPresensi = presensi.filter((item) => {
    const itemDate = dayjs(item.tanggal);
    return (
      itemDate.month() === tanggal.month() && itemDate.year() === tanggal.year()
    );
  });
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

  // filter date
  const filteredTransaksi = transaksi.filter((item) => {
    const itemDate = dayjs(item.tanggal_penerimaan);
    return (
      itemDate.month() === tanggal.month() &&
      itemDate.year() === tanggal.year() &&
      item.status === "selesai"
    );
  });
  const filteredPengeluaranLain = pengeluaranLain.filter((item) => {
    const itemDate = dayjs(item.tanggal_pengeluaran);
    return (
      itemDate.month() === tanggal.month() && itemDate.year() === tanggal.year()
    );
  });
  const filteredPengeluaranBahanBaku = pengeluaranBahanBaku.filter((item) => {
    const itemDate = dayjs(item.tglPembelian);
    return (
      itemDate.month() === tanggal.month() && itemDate.year() === tanggal.year()
    );
  });
  //hitung total
  const totalPemasukan = () => {
    let total = 0;
    for (const item of filteredTransaksi) {
      total += item.total_harga;
    }
    return total;
  };
  const totalTip = () => {
    let total = 0;
    for (const item of filteredTransaksi) {
      total += item.tip;
    }
    return total;
  };
  const totalPengeluaranLain = () => {
    let total = 0;
    for (const item of filteredPengeluaranLain) {
      total += item.nominal;
    }
    return total;
  };
  const totalPengeluaranBahanBaku = () => {
    let total = 0;
    for (const item of filteredPengeluaranBahanBaku) {
      total += item.harga;
    }
    return total;
  };
  const totalGaji = () => {
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
          Pemasukan dan Pengeluaran per Bulan
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
        <div className="border border-1 p-3 m-3">
          <p className="customP text-decoration-underline">
            <strong>LAPORAN PEMASUKAN DAN PENGELUARAN</strong>
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
                  <TableCell></TableCell>
                  <TableCell align="right">Pemasukan</TableCell>
                  <TableCell align="right">Pengeluaran</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Pemasukan</TableCell>
                  <TableCell align="right">
                    Rp. {totalPemasukan().toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tip</TableCell>
                  <TableCell align="right">
                    Rp. {totalTip().toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bahan Baku</TableCell>
                  <TableCell colSpan={2} align="right">
                    Rp. {totalPengeluaranBahanBaku().toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gaji Karyawan</TableCell>
                  <TableCell colSpan={2} align="right">
                    Rp. {totalGaji().toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
                {filteredPengeluaranLain.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell component="th" scope="row">
                      {item.rincian}
                    </TableCell>
                    <TableCell colSpan={2} align="right">
                      Rp.
                      {item.nominal.toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">
                    Rp.{" "}
                    {(totalPemasukan() + totalTip()).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="right">
                    Rp.{" "}
                    {(
                      totalPengeluaranLain() +
                      totalGaji() +
                      totalPengeluaranBahanBaku()
                    ).toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </Container>
  );
};

export default LaporanPemasukandanPengeluaran;
