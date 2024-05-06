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
  CreateHampers,
  DeleteHampers,
  GetAllHampers,
  UpdateHampers,
} from "../../../api/apiHampers";
import CustomTable from "../../../components/CustomTable";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  FormControlLabel,
  Switch,
  Avatar,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { MoneyFormat, NumberFormat } from "../../../components/NumericFormat";
import { GetAllProduk } from "../../../api/apiProduk";

export const tableHeader = [
  { id: "nama", label: "Nama Hampers", minWidth: 150 },

  {
    id: "rincian",
    label: "Rincian",
    minWidth: 40,
  },

  {
    id: "harga",
    label: "Harga Hampers",
    minWidth: 40,
    format: (value) => `Rp. ${value.toLocaleString("id-ID")}`,
  },
];

const Hampers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [hampers, setHampers] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [produk1, setProduk1] = useState([]);
  const [produk2, setProduk2] = useState([]);
  const [produkMap1, setProdukMap1] = useState([]);
  const [produkMap2, setProdukMap2] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  const [isTitipan, setIsTitipan] = useState(false);
  const [data, setData] = useState({
    nama: "",
    id_produk1: "",
    id_produk2: "",
    rincian: "",
    harga: "",
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
  const fetchHampers = () => {
    setIsLoading(true);
    fetchProduk();
    GetAllHampers()
      .then((response) => {
        setHampers(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchHampers();
  }, []);

  const clearAll = () => {
    setThumbnail(null);
    setData({
      nama: "",
      id_produk1: "",
      id_produk2: "",
      rincian: "",
      harga: "",
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
    DeleteHampers(id)
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
    fetchHampers();
  };

  //FETCH PRODUK
  const fetchProduk = () => {
    GetAllProduk()
      .then((response) => {
        const produksMap1 = {};
        const produksMap2 = {};
        setProduk1(response);
        setProduk2(response);
        response.forEach((produk) => {
          produksMap1[produk.id] = produk.nama;
          produksMap2[produk.id] = produk.nama;
        });
        setProdukMap1(produksMap1);
        setProdukMap2(produksMap2);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);
    setIsDelDisabled(true);
    if (selectedRow) {
      UpdateHampers(data)
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
          fetchHampers();
        });
    } else {
      const formData = new FormData();

      formData.append("nama", data.nama);
      formData.append("id_produk1", data.id_produk1);
      formData.append("id_produk2", data.id_produk2);
      formData.append("rincian", data.rincian);
      formData.append("harga", data.harga);
      formData.append("image", thumbnail);

      CreateHampers(formData)
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
          fetchHampers();
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
        <h1 className="h4 fw-bold mb-0 text-nowrap">Hampers</h1>
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
                    <FormControl fullWidth>
                      <InputLabel id="label-jabatan">ID Produk 1</InputLabel>
                      <Select
                        disabled={!isFilling}
                        labelId="label-jabatan"
                        label="Jabatan"
                        value={data.id_produk1}
                        name="id_produk1"
                        onChange={handleChange}
                      >
                        {produk1.map((produk) => (
                          <MenuItem key={produk.id} value={produk.id}>
                            {produk.nama}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Col>
                  <Col>
                    <FormControl fullWidth>
                      <InputLabel id="label-jabatan">ID Produk 2</InputLabel>
                      <Select
                        disabled={!isFilling}
                        labelId="label-jabatan"
                        label="Jabatan"
                        value={data.id_produk2}
                        name="id_produk2"
                        onChange={handleChange}
                      >
                        {produk2.map((produk) => (
                          <MenuItem key={produk.id} value={produk.id}>
                            {produk.nama}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Col>
                </Row>
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
                      InputProps={{ inputComponent: NumberFormat }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextField
                      fullWidth
                      label="Rincian"
                      name="rincian"
                      variant="outlined"
                      color="primary"
                      value={data.rincian}
                      disabled={!isFilling}
                      onChange={handleChange}
                    />
                  </Col>
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
                    data.rincian.trim() === "" ||
                    (typeof data.harga === "string"
                      ? data.harga.trim() === ""
                      : data.harga === "") ||
                    (typeof data.id_produk1 === "string"
                      ? data.id_produk1.trim() === ""
                      : data.id_produk1 === "") ||
                    (typeof data.id_produk2 === "string"
                      ? data.id_produk2.trim() === ""
                      : data.id_produk2 === "")
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
        ) : hampers?.length > 0 ? (
          <CustomTable
            tableHeader={tableHeader}
            data={hampers}
            handleRowClick={handleRowClick}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <Alert variant="secondary" className="mt-3 text-center">
              Belum ada Hampers....
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

export default Hampers;
