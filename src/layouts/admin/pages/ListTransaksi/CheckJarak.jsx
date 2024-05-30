import { Alert, Button, Card, Col, Spinner, Stack } from "react-bootstrap";
import dayjs from "dayjs";
import { useState } from "react";
import { UpdateTransaksi } from "../../../../api/apiTransaksi";
import { toast } from "react-toastify";
import { InputAdornment, TextField } from "@mui/material";
import { NumberFormat } from "../../../../components/NumericFormat";

const CheckJarak = ({ transaksi, fetchTransaksi }) => {
  const [isPending, setIsPending] = useState(false);
  const [jarak, setJarak] = useState("0");

  const checkHargaKirim = () => {
    if (jarak <= 0) {
      return 0;
    }
    if (jarak <= 5) {
      return 10000;
    } else if (jarak > 5 && jarak <= 10) {
      return 15000;
    } else if (jarak > 10 && jarak <= 15) {
      return 20000;
    } else {
      return 25000;
    }
  };
  const hargaTanpaKirim = transaksi.map((atransaksi) => {
    return atransaksi.detail.reduce((total, adetail) => {
      const hargaProduk = adetail.produk
        ? adetail.produk.harga * adetail.jumlah
        : 0;
      const hargaHampers = adetail.hampers
        ? adetail.hampers.harga * adetail.jumlah
        : 0;
      return total + hargaProduk + hargaHampers;
    }, 0);
  });
  const handleKonfirmasi = (konfirm, atransaksi) => {
    setIsPending(true);
    const data = {
      id: atransaksi.id,
      status: konfirm,
      jarak: jarak,
      total_harga: hargaTanpaKirim[0] + checkHargaKirim(),
    };
    UpdateTransaksi(data)
      .then((res) => {
        toast.success("Berhasil");
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Gagal");
      })
      .finally(() => {
        setIsPending(false);
        fetchTransaksi();
      });
  };
  return transaksi?.length > 0 ? (
    <Col className="p-5">
      {transaksi.map((atransaksi, index) => (
        <Card key={index} className="p-4 mb-4">
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
            Total Pembayaran: {hargaTanpaKirim[0] + checkHargaKirim()}
            {" = "}
            {hargaTanpaKirim}
            {" + "} {checkHargaKirim()}
          </p>

          {!isPending ? (
            <Stack
              className="d-flex justify-content-end"
              direction="horizontal"
              gap={3}
            >
              <TextField
                name="jarak"
                value={jarak}
                label="Jarak"
                disabled={isPending}
                InputProps={{
                  inputComponent: NumberFormat,
                  endAdornment: (
                    <InputAdornment position="end">Km</InputAdornment>
                  ),
                }}
                onChange={(event) => setJarak(event.target.value)}
              />

              <Button
                size="lg"
                variant="danger"
                onClick={() => handleKonfirmasi("dibatalkan", atransaksi)}
                disabled={isPending}
              >
                Tolak
              </Button>
              <Button
                size="lg"
                variant="success"
                onClick={() => handleKonfirmasi("belum dibayar", atransaksi)}
                disabled={isPending || jarak.trim() === "" || jarak <= 0}
              >
                Simpan
              </Button>
            </Stack>
          ) : (
            <div className="d-flex justify-content-end">
              <Spinner animation="border" variant="primary"></Spinner>
            </div>
          )}
        </Card>
      ))}
    </Col>
  ) : (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "75vh" }}
    >
      <Alert variant="secondary" className="mt-3 text-center">
        Belum ada Pesanan untuk dikonfirmasi....
      </Alert>
    </div>
  );
};

export default CheckJarak;
