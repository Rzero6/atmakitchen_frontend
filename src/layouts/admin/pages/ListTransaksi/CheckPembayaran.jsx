import {
  Alert,
  Button,
  Card,
  Col,
  Modal,
  Spinner,
  Stack,
} from "react-bootstrap";
import dayjs from "dayjs";
import { useState } from "react";
import { UpdateTransaksi } from "../../../../api/apiTransaksi";
import { toast } from "react-toastify";
import { getBuktiBayar } from "../../../../api";
import { InputAdornment, TextField } from "@mui/material";
import { NumberFormat } from "../../../../components/NumericFormat";

const CheckPembayaran = ({ transaksi, fetchTransaksi }) => {
  const [isPending, setIsPending] = useState(false);
  const [dibayar, setDibayar] = useState("0");
  const [show, setShow] = useState(false);
  const [link, setLink] = useState("");
  const handleKonfirmasi = (konfirm, atransaksi) => {
    setIsPending(true);
    const data = {
      id: atransaksi.id,
      status: konfirm,
      tip: dibayar - atransaksi.total_harga,
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
  const checkHargaKirim = (jarak) => {
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
  const handleShowModal = (link) => {
    setShow(true);
    setLink(link);
  };
  const handleCloseModal = () => {
    setShow(false);
    setLink("");
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
            <>
              <p className="customP">
                Penerima : {atransaksi.alamat.nama_penerima},{" "}
                {"(" + atransaksi.alamat.no_telepon + ")"}
              </p>
              <p className="customP">
                Alamat : {atransaksi.alamat.jalan}, {atransaksi.alamat.kota}
              </p>
            </>
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
            {atransaksi.total_harga.toLocaleString("id-ID") + " = Rp. "}
            {atransaksi.detail
              .reduce((total, adetail) => {
                const hargaProduk = adetail.produk
                  ? adetail.produk.harga * adetail.jumlah
                  : 0;
                const hargaHampers = adetail.hampers
                  ? adetail.hampers.harga * adetail.jumlah
                  : 0;
                return total + hargaProduk + hargaHampers;
              }, 0)
              .toLocaleString("id-ID")}{" "}
            {atransaksi.id_alamat !== null && (
              <span>
                + Rp.{" "}
                {checkHargaKirim(atransaksi.jarak).toLocaleString("id-ID")}{" "}
                (Pengiriman)
              </span>
            )}
            {dibayar - atransaksi.total_harga > 0 && (
              <span>
                + Rp.{" "}
                {(dibayar - atransaksi.total_harga).toLocaleString("id-ID")}{" "}
                (Tip)
              </span>
            )}
          </p>
          {!isPending ? (
            <Stack
              className="d-flex justify-content-end mt-2"
              direction="horizontal"
              gap={3}
            >
              <TextField
                name="dibayar"
                value={dibayar}
                label="Dibayar"
                disabled={isPending}
                InputProps={{
                  inputComponent: NumberFormat,
                  startAdornment: (
                    <InputAdornment position="start">Rp</InputAdornment>
                  ),
                }}
                onChange={(event) => setDibayar(event.target.value)}
              />
              <Button
                variant="primary"
                onClick={() =>
                  handleShowModal(getBuktiBayar(atransaksi.bukti_bayar))
                }
                disabled={isPending}
              >
                Lihat Bukti Bayar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleKonfirmasi("dibatalkan", atransaksi)}
                disabled={isPending}
              >
                Tolak
              </Button>
              <Button
                variant="success"
                onClick={() => handleKonfirmasi("pembayaran valid", atransaksi)}
                disabled={
                  isPending ||
                  dibayar.trim() === "" ||
                  dibayar < atransaksi.total_harga ||
                  dibayar.trim() === "-"
                }
              >
                Validasi
              </Button>
            </Stack>
          ) : (
            <div className="d-flex justify-content-end">
              <Spinner animation="border" variant="primary"></Spinner>
            </div>
          )}
        </Card>
      ))}
      {/* Modal */}
      {setShow && (
        <Modal show={show} onHide={handleCloseModal} centered size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>Lihat Bukti Bayar</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center">
              <img src={link} style={{ width: "75vh", height: "75vh" }} />
            </div>
            <Stack
              direction="horizontal"
              gap={2}
              className="justify-content-end mt-2"
            >
              <TextField
                name="dibayar"
                value={dibayar}
                label="Dibayar"
                disabled={isPending}
                InputProps={{
                  inputComponent: NumberFormat,
                  startAdornment: (
                    <InputAdornment position="start">Rp</InputAdornment>
                  ),
                }}
                onChange={(event) => setDibayar(event.target.value)}
              />
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isPending}
              >
                OK
              </Button>
            </Stack>
          </Modal.Body>
        </Modal>
      )}
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

export default CheckPembayaran;
