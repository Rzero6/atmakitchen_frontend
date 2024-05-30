import { Box } from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Alert, Button, Modal, Row, Spinner, Stack } from "react-bootstrap";
import { FaImage } from "react-icons/fa";
import { UploadBuktiBayarTransaksi } from "../../../../api/apiTransaksi";

const PembayaranTransaksi = ({ transaksi, fetchTransaksi }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [show, setShow] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [sent, setSent] = useState(false);
  const handleThumbnail = (event) => {
    setThumbnail(event.target.files[0]);
  };
  const [message, setMessage] = useState("");
  const uploadImage = () => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("bukti_bayar", thumbnail);
    UploadBuktiBayarTransaksi(formData, transaksi.id)
      .then((res) => {
        setSent(true);
        setMessage("Berhasil Kirim Bukti Bayar");
        setIsPending(false);
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.message);
        setIsPending(false);
      });
  };
  const closeModal = () => {
    setShow(false);
    setThumbnail(null);
    fetchTransaksi();
  };
  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Kirim Bukti Bayar
      </Button>
      {show && (
        <Modal
          show={show}
          onHide={() => setShow(false)}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Transaksi{" "}
              <strong>
                {dayjs(transaksi.tanggal_penerimaan).format("YY.MM.") +
                  transaksi.id}
              </strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={2}>
              <div style={{ overflowY: "auto", maxHeight: "100px" }}>
                <Stack>
                  <p className="customP">Barang yang dibeli: </p>
                  {transaksi.detail.map((adetail, index2) => (
                    <p className="customP" key={index2}>
                      {adetail.produk
                        ? adetail.jumlah +
                          " " +
                          adetail.produk.nama +
                          " " +
                          adetail.produk.ukuran
                        : adetail.jumlah + " " + adetail.hampers.nama}
                      {index2 !== transaksi.detail.length - 1 && ", "}
                    </p>
                  ))}
                </Stack>
              </div>
              <p className="customP">
                Total Pembayaran:
                <strong>
                  {" Rp. " +
                    (
                      transaksi.detail.reduce((total, adetail) => {
                        const hargaProduk = adetail.produk
                          ? adetail.produk.harga * adetail.jumlah
                          : 0;
                        const hargaHampers = adetail.hampers
                          ? adetail.hampers.harga * adetail.jumlah
                          : 0;
                        return total + hargaProduk + hargaHampers;
                      }, 0) + transaksi.tip
                    ).toLocaleString("id-ID")}{" "}
                </strong>
              </p>

              <div
                className="img-preview border border-3 border-black"
                style={{
                  maxWidth: "500px",
                  maxHeight: "500px",
                  aspectRatio: "4/3",
                }}
              >
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail"
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <div className="d-flex justify-content-center">
                    <FaImage size={250} />
                  </div>
                )}
                <Button
                  variant="primary"
                  type="button"
                  disabled={isPending}
                  size="sm"
                  className="w-fit h-fit position-absolute bottom-0 end-0 me-3 mb-3"
                  onClick={() => document.getElementById("thumbnail").click()}
                >
                  <FaImage /> Masukan Bukti Pembayaran
                </Button>
                {/* Input type file yang disembunyikan, diakses pakai tombol diatas */}
                <input
                  type="file"
                  name="thumbnail"
                  id="thumbnail"
                  className="d-none"
                  onChange={handleThumbnail}
                  accept="image/*"
                />
              </div>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Stack>
              <div>
                {typeof message === "string" && message.trim() !== "" && (
                  <Alert variant={sent ? "success" : "danger"}>{message}</Alert>
                )}
              </div>
              <Stack
                direction="horizontal"
                gap={2}
                className="justify-content-end"
              >
                <Button
                  variant="primary"
                  disabled={isPending || thumbnail === null}
                  onClick={sent ? closeModal : uploadImage}
                >
                  {isPending ? (
                    <>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Loading...
                    </>
                  ) : (
                    <span>{sent ? "Kembali" : "Kirim"}</span>
                  )}
                </Button>
                {!sent && (
                  <Button
                    variant="danger"
                    onClick={closeModal}
                    disabled={isPending}
                  >
                    Batal
                  </Button>
                )}
              </Stack>
            </Stack>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default PembayaranTransaksi;
