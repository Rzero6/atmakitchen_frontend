import React from "react";
import { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa";
import {
  Alert,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Stack,
  Spinner,
  Form,
} from "react-bootstrap";
import Paper from "@mui/material/Paper";
import {
  CreateProduk,
  DeleteProduk,
  GetAllProduk,
  UpdateProduk,
} from "../../../api/apiProduk";
import CustomTable from "../../../components/CustomTable";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  FormControlLabel,
  Switch,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import { MoneyFormat, NumberFormat } from "../../../components/NumericFormat";

export const tableHeader = [
  { id: "nama", label: "Nama Produk", minWidth: 250 },
  {
    id: "stok",
    label: "Stok",
    minWidth: 50,
    format: (value) => value.toLocaleString("id-ID"),
  },
  {
    id: "limit_po",
    label: "Limit PO",
    minWidth: 50,
    format: (value) => (value ? value.toLocaleString("id-ID") : "-"),
  },
  { id: "jenis", label: "Jenis Produk", minWidth: 50 },
  { id: "ukuran", label: "Ukuran", minWidth: 50 },
  {
    id: "harga",
    label: "Harga Produk",
    minWidth: 50,
    format: (value) => `Rp. ${value.toLocaleString("id-ID")}`,
  },
];

const Produk = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [produk, setProduk] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  const [isTitipan, setIsTitipan] = useState(false);
  const [data, setData] = useState({
    nama: "",
    stok: "",
    harga: "",
    limit_po: "",
    ukuran: "",
    jenis: "",
  });
  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleThumbnail = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const handleRowClick = (row) => {
    clearAll();
    setSelectedRow(row);
    setIsEditDisabled(false);
    setIsDelDisabled(false);
    setData(row);
  };
  const fetchProduk = () => {
    setIsLoading(true);
    GetAllProduk()
      .then((response) => {
        setProduk(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  const clearAll = () => {
    setData({
      nama: "",
      stok: "",
      harga: "",
      jenis: "",
      ukuran: "",
      limit_po: "",
    });
    setSelectedRow(null);
    setIsAddDisabled(false);
    setIsDelDisabled(true);
    setIsEditDisabled(true);
    setIsFilling(false);
  };

  const addData = () => {
    clearAll();
    setIsDelDisabled(false);
    setIsAddDisabled(true);
    setIsFilling(true);
  };

  const editData = () => {
    setIsEditDisabled(true);
    setIsDelDisabled(false);
    setIsAddDisabled(true);
    setIsFilling(true);
  };

  const delData = (id) => {
    setIsPending(true);
    DeleteProduk(id)
      .then((response) => {
        setIsPending(false);
        toast.success(response.message);
      })
      .catch((err) => {
        console.log(err);
        toast.dark(err.message);
      })
      .finally(() => {
        setIsPending(false);
        handleCloseModal();
      });
  };

  const handleShowModal = (type) => {
    setShowModal(true);
    console.log("show");
    setModalType(type);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    clearAll();
    fetchProduk();
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);
    setIsDelDisabled(true);
    if (selectedRow) {
      UpdateProduk(data)
        .then((response) => {
          toast.success(response.message);
        })
        .catch((err) => {
          console.log(err);
          toast.error(JSON.stringify(err.message));
        })
        .finally(() => {
          setIsPending(false);
          clearAll();
          fetchProduk();
        });
    } else {
      const formData = new FormData();

      formData.append("nama", data.nama);
      formData.append("stok", data.stok);
      formData.append("ukuran", data.ukuran);
      formData.append("jenis", data.jenis);
      formData.append("limit_po", data.limit_po);
      formData.append("harga", data.harga);
      formData.append("image", thumbnail);

      CreateProduk(formData)
        .then((response) => {
          toast.success(response.message);
        })
        .catch((err) => {
          console.log(err);
          toast.error(JSON.stringify(err.message));
        })
        .finally(() => {
          setIsPending(false);
          clearAll();
          fetchProduk();
        });
    }
  };

  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Produk</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-50" />
      </Stack>

      <Row className="justify-content-center align-items-center">
        <Paper
          className="mb-3 p-3"
          sx={{ width: "100vh", overflow: "hidden", overflowX: "auto" }}
        >
          <Form>
            <Row>
              <Col>
                <FormControlLabel
                  value={isTitipan}
                  control={<Switch color="primary" />}
                  label={isTitipan ? "Titipan" : "Tidak Titipan"}
                  onChange={() => setIsTitipan(!isTitipan)}
                  labelPlacement="start"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <div
                  className="img-preview text-center position-relative mb-3"
                  style={{ aspectRatio: "16 / 9.25" }}
                >
                  {thumbnail ? (
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <img
                      src="https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg"
                      alt="Thumbnail"
                      className="w-100 h-100 object-fit-cover"
                    />
                  )}
                  <Button
                    variant="primary"
                    type="button"
                    disabled={isPending || !isFilling}
                    size="sm"
                    className="w-fit h-fit position-absolute bottom-0 end-0 me-3 mb-3"
                    onClick={() => document.getElementById("thumbnail").click()}
                  >
                    <FaImage /> Pilih Thumbnail
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
              </Col>
              <Col>
                <Row className="mb-2">
                  <Col>
                    <TextField
                      fullWidth
                      label="Nama"
                      name="nama"
                      variant="outlined"
                      color="primary"
                      value={data.nama}
                      disabled={!isFilling}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <TextField
                      fullWidth
                      label="Ukuran"
                      name="ukuran"
                      variant="outlined"
                      color="primary"
                      value={data.ukuran}
                      disabled={!isFilling}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <TextField
                      fullWidth
                      label="Jenis"
                      name="jenis"
                      variant="outlined"
                      color="primary"
                      value={data.jenis}
                      disabled={!isFilling}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col>
                    <TextField
                      fullWidth
                      label="Harga"
                      name="harga"
                      variant="outlined"
                      color="primary"
                      value={data.harga}
                      disabled={!isFilling}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextField
                      fullWidth
                      label="Stok"
                      name="stok"
                      variant="outlined"
                      color="primary"
                      value={data.stok}
                      disabled={!isFilling}
                      onChange={handleChange}
                      InputProps={{ inputComponent: NumberFormat }}
                    />
                  </Col>

                  {!isTitipan && (
                    <Col>
                      <TextField
                        fullWidth
                        label="Limit PO"
                        name="limit_po"
                        variant="outlined"
                        color="primary"
                        value={data.limit_po}
                        disabled={!isFilling}
                        onChange={handleChange}
                        InputProps={{ inputComponent: NumberFormat }}
                      />
                    </Col>
                  )}
                </Row>
                <Row></Row>
              </Col>
            </Row>
            <Row></Row>

            <Stack direction="horizontal" gap={3}>
              {isAddDisabled ? (
                <Button
                  style={{ width: "100px" }}
                  className="flex-grow-1"
                  size="lg"
                  variant="success"
                  onClick={submitData}
                  disabled={
                    data.nama.trim() === "" ||
                    (typeof data.stok === "string"
                      ? data.stok.trim() === ""
                      : data.stok === "") ||
                    data.ukuran.trim() === "" ||
                    (typeof data.harga === "string"
                      ? data.harga.trim() === ""
                      : data.harga === "") ||
                    data.jenis.trim() === "" ||
                    (typeof data.limit_po === "string"
                      ? data.limit_po.trim() === ""
                      : data.limit_po === "")
                  }
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
                    <span>Simpan</span>
                  )}
                </Button>
              ) : (
                <Button
                  style={{ width: "100px" }}
                  className="flex-grow-1"
                  size="lg"
                  variant="success"
                  disabled={isLoading}
                  onClick={() => addData()}
                >
                  Tambah
                </Button>
              )}
              <Button
                style={{ width: "100px" }}
                className="flex-grow-1"
                size="lg"
                variant="warning"
                onClick={() => editData()}
                disabled={isEditDisabled}
              >
                Ubah
              </Button>
              <Button
                style={{ width: "100px" }}
                className="flex-grow-1"
                size="lg"
                variant="danger"
                onClick={
                  isFilling ? () => clearAll() : () => handleShowModal("Hapus")
                }
                disabled={isDelDisabled}
              >
                {isFilling ? "Batal" : "Hapus"}
              </Button>
            </Stack>
          </Form>
        </Paper>
        {isLoading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        ) : produk?.length > 0 ? (
          <CustomTable
            tableHeader={tableHeader}
            data={produk}
            handleRowClick={handleRowClick}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <Alert variant="secondary" className="mt-3 text-center">
              Belum ada Produk....
            </Alert>
          </div>
        )}
      </Row>

      {/* Modal */}
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Konfirmasi <strong>{modalType}</strong> Data
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack
              direction="horizontal"
              gap={2}
              className="justify-content-end"
            >
              <Button variant="primary" onClick={() => delData(selectedRow.id)}>
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
                  <span>OK</span>
                )}
              </Button>
              <Button
                variant="danger"
                onClick={handleCloseModal}
                disabled={isPending}
              >
                Batal
              </Button>
            </Stack>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default Produk;
