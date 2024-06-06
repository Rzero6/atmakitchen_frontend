import React, { useEffect } from "react";
import { useState } from "react";
import {
  Container,
  Stack,
  Spinner,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";
import {
  GetAllHistoriSaldo,
  UpdateHistoriSaldo,
  UploadBuktiTransfer,
} from "../../../api/apiHistoriSaldo";
import { Divider, ListItem, ListItemText } from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import KonfirmasiModal from "../../../components/modals/KonfirmasiModal";
import { FaImage } from "react-icons/fa";

const KonfirmasiTarikSaldo = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [histori, setHistori] = useState([]);
  const [data, setData] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const handleThumbnail = (event) => {
    setThumbnail(event.target.files[0]);
  };
  const fetchHistori = () => {
    setIsLoading(true);
    GetAllHistoriSaldo()
      .then((response) => {
        setHistori(response.filter((item) => item.status !== 1));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handlePengajuan = () => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("bukti_transfer", thumbnail);
    UploadBuktiTransfer(formData, data.id)
      .then((res) => {
        UpdateHistoriSaldo({ status: 1, id: data.id })
          .then((res) => {
            toast.success("Berhasil");
            fetchHistori();
            setShow(false);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Uh oh, terjadi kesalahan");
          })
          .finally(() => {
            setIsLoading(false);
            setIsPending(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setIsPending(false);
      });
  };
  const handleTolak = (item) => {
    setIsLoading(true);
    UpdateHistoriSaldo({ id: item.id, status: 1, bukti_transfer: "ditolak" })
      .then((res) => {
        toast.success("Berhasil");
        fetchHistori();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh oh, terjadi kesalahan");
      })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    fetchHistori();
  }, []);
  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">
          Pengajuan Penarikan Saldo
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
      ) : histori.length > 0 ? (
        histori.map((item, index) => (
          <div key={index}>
            <ListItem key={item.id}>
              <ListItemText
                primary={item.customer.user.nama}
                secondary={dayjs(item.updated_at).format("HH:mm, DD MMMM YYYY")}
              />
              <ListItemText
                className={`${
                  item.mutasi <= 0 ? "text-danger" : "text-success"
                } text-end`}
                primary={`${item.mutasi < 0 ? "-" : "+"} Rp. ${Math.abs(
                  item.mutasi
                ).toLocaleString("id-ID")}`}
                secondary={`saldo =
                Rp. ${item.customer.saldo.toLocaleString("id-ID")}`}
              />
              <Stack
                direction="horizontal"
                className="justify-content-end w-25"
              >
                {item.customer.saldo + item.mutasi < 0 ? (
                  <Button className="w-100 m-1" variant="warning" disabled>
                    Saldo kurang
                  </Button>
                ) : (
                  <Button
                    className="w-100 m-1"
                    variant="success"
                    onClick={() => {
                      setShow(true);
                      setData(item);
                    }}
                  >
                    Terima
                  </Button>
                )}
                <KonfirmasiModal
                  title={"Tolak"}
                  buttonVariant={"danger"}
                  data={item}
                  handleOK={() => handleTolak(item)}
                />
              </Stack>
            </ListItem>
            <Divider sx={{ borderWidth: 1 }} />
          </div>
        ))
      ) : (
        <>Belum ada penarikan saldo</>
      )}

      {/* Modal */}
      {setShow && (
        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Konfirmasi <strong>Pengajuan Tarik Saldo</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="img-preview"
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
          </Modal.Body>

          <Modal.Footer>
            <Stack
              direction="horizontal"
              gap={2}
              className="justify-content-end"
            >
              <Button
                variant="primary"
                disabled={isPending}
                onClick={handlePengajuan}
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
                  <span>Kirim Bukti Transfer</span>
                )}
              </Button>
              <Button
                variant="danger"
                onClick={() => setShow(false)}
                disabled={isPending}
              >
                Batal
              </Button>
            </Stack>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default KonfirmasiTarikSaldo;
