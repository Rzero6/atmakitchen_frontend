import { Alert, Button, Card, Col, Spinner, Stack } from "react-bootstrap";
import dayjs from "dayjs";
import { useState } from "react";
import { UpdateTransaksi } from "../../../api/apiTransaksi";
import { toast } from "react-toastify";

const KonfirmasiPesanan = ({ transaksi, fetchTransaksi }) => {
  const [isPending, setIsPending] = useState(false);
  const handleKonfirmasi = (konfirm, atransaksi) => {
    setIsPending(true);
    const data = {
      id: atransaksi.id,
      status: konfirm,
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

          {!isPending ? (
            <Stack
              className="d-flex justify-content-end"
              direction="horizontal"
              gap={3}
            >
              <Button
                variant="danger"
                onClick={() => handleKonfirmasi("ditolak", atransaksi)}
                disabled={isPending}
              >
                Tolak
              </Button>
              <Button
                variant="success"
                onClick={() => handleKonfirmasi("diterima", atransaksi)}
                disabled={isPending}
              >
                Terima
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

export default KonfirmasiPesanan;
