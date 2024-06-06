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

const LaporanPenggunaanBahanBaku = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tanggal, setTanggal] = useState({
    first: dayjs().subtract(1, "day"),
    last: dayjs(),
  });
  const [bahanbaku, setBahanBaku] = useState([]);
  const [transaksi, setTransaksi] = useState([]);

  const handleChangeTanggal = (date) => {
    setTanggal({ ...tanggal, first: date });
    fetchTransaksi();
  };
  const handleChangeTanggalLast = (date) => {
    setTanggal({ ...tanggal, last: date });
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
    fetchTransaksi();
  }, []);

  //filter date
  const filteredTransaksi = transaksi.filter((item) => {
    const itemDate = dayjs(item.tanggal_penerimaan);
    return (
      (itemDate.isSame(tanggal.first) ||
        itemDate.isSame(tanggal.last) ||
        (itemDate.isAfter(tanggal.first) && itemDate.isBefore(tanggal.last))) &&
      item.status === "selesai"
    );
  });
  console.log(filteredTransaksi);

  const totalTakaranBahan = (id_bahan_baku) => {
    let count = 0;
    for (const transaksi of filteredTransaksi) {
      for (const detail of transaksi.detail) {
        if (detail.id_produk !== null) {
          for (const resep of detail.produk.resep) {
            if (resep.id_bahan_baku === id_bahan_baku) {
              count += resep.takaran * detail.jumlah;
            }
          }
        }
        if (detail.id_hampers !== null) {
          for (const detailhampers of detail.hampers.detailhampers) {
            if (detailhampers.id_produk !== null) {
              for (const resep of detailhampers.produk.resep) {
                if (resep.id_bahan_baku === id_bahan_baku) {
                  count += resep.takaran * detailhampers.jumlah;
                }
              }
            }
            if (detailhampers.id_bahan_baku !== null) {
              if (detailhampers.id_bahan_baku === id_bahan_baku) {
                count += detailhampers.jumlah;
              }
            }
          }
        }
      }
    }
    return count;
  };

  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Penggunaan Bahan Baku</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-100" />
      </Stack>
      <div className="d-flex justify-content-center">
        <Stack gap={3} direction="horizontal">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={tanggal.first}
              maxDate={tanggal.last}
              name="first"
              label={"Pilih Tanggal"}
              onChange={handleChangeTanggal}
            />
            <hr
              className="border-top border-dark border-2 opacity-100"
              style={{ width: "10px" }}
            />
            <DatePicker
              value={tanggal.last}
              minDate={tanggal.first}
              name="last"
              label={"Pilih Tanggal"}
              onChange={handleChangeTanggalLast}
            />
          </LocalizationProvider>
        </Stack>
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
              <strong>LAPORAN Penggunaan Bahan Baku</strong>
            </p>
            <p className="customP">
              Periode: {dayjs(tanggal.first).format("DD MMMM YYYY")} -{" "}
              {dayjs(tanggal.last).format("DD MMMM YYYY")}
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
                    <TableCell align="right">Digunakan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bahanbaku.map((bahanBaku) => (
                    <TableRow key={bahanBaku.id}>
                      <TableCell></TableCell>
                      <TableCell align="left">{bahanBaku.nama}</TableCell>
                      <TableCell align="right">{bahanBaku.satuan}</TableCell>
                      <TableCell align="right">
                        {totalTakaranBahan(bahanBaku.id).toLocaleString(
                          "id-ID"
                        )}
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

export default LaporanPenggunaanBahanBaku;
