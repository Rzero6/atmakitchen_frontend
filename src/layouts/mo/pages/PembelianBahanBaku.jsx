import React from "react";
import { useState, useEffect } from "react";
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
  CreatePembelianBahanBaku,
  DeletePembelianBahanBaku,
  GetAllPembelianBahanBaku,
  UpdatePembelianBahanBaku,
} from "../../../api/apiPembelianBahanBaku";
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MoneyFormat, NumberFormat } from "../../../components/NumericFormat";
import { GetAllBahanBaku } from "../../../api/apiBahanBaku";

export const tableHeader = [
  { id: "nama_bb", label: "Bahan Baku", minWidth: 100 },
  { id: "jumlah", label: "Jumlah", minWidth: 100 },
  {
    id: "harga",
    label: "Harga",
    minWidth: 100,
    format: (value) => `Rp. ${value.toLocaleString("id-ID")}`,
  },
  { id: "tglPembelian", label: "Tanggal Pembelian", minWidth: 100 },
];

const PembelianBahanBaku = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [pembelianBahanBaku, setPembelianBahanBaku] = useState([]);
  const [bahanbaku, setBahanBaku] = useState([]);
  const [bahanBakuMap, setBahanBakuMap] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  const [data, setData] = useState({
    id_bahanBaku: "",
    jumlah: "",
    tglPembelian: dayjs().format("YYYY-MM-DD"),
    harga: "",
  });
  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleRowClick = (row) => {
    clearAll();
    setSelectedRow(row);
    setIsEditDisabled(false);
    setIsDelDisabled(false);
    setData(row);
  };
  const fetchPembelianBahanBaku = () => {
    setIsLoading(true);
    fetchBahanBaku();
    GetAllPembelianBahanBaku()
      .then((response) => {
        const pembelianWithNamaBB = response.map((pembelianBahanBaku) => ({
          ...pembelianBahanBaku,
          nama_bb: bahanBakuMap[pembelianBahanBaku.id_bahanBaku],
        }));
        setPembelianBahanBaku(pembelianWithNamaBB);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  // FETCH BAHAN BAKU
  const fetchBahanBaku = () => {
    GetAllBahanBaku()
      .then((response) => {
        const bahanBakusMap = {};
        setBahanBaku(response);
        response.forEach((bahanbaku) => {
          bahanBakuMap[bahanbaku.id] = bahanbaku.nama;
        });
        setBahanBakuMap(bahanBakusMap);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchPembelianBahanBaku();
  }, []);

  const clearAll = () => {
    setData({
      id_bahanBaku: "",
      jumlah: "",
      tglPembelian: dayjs().format("YYYY-MM-DD"),
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
    DeletePembelianBahanBaku(id)
      .then((response) => {
        setIsPending(false);
        toast.success(response.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
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
    fetchPembelianBahanBaku();
  };

  const submitData = (event) => {
    event.preventDefault();
    console.log(data.tglPembelian);
    setIsPending(true);
    setIsDelDisabled(true);
    if (selectedRow) {
      UpdatePembelianBahanBaku(data)
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
          fetchPembelianBahanBaku();
        });
    } else {
      const formData = new FormData();
      formData.append("id_bahanBaku", data.id_bahanBaku);
      formData.append("jumlah", data.jumlah);
      formData.append("tglPembelian", data.tglPembelian);
      formData.append("harga", data.harga);
      CreatePembelianBahanBaku(formData)
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
          fetchPembelianBahanBaku();
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
        <h1 className="h4 fw-bold mb-0 text-nowrap">Pembelian Bahan Baku</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-50" />
      </Stack>

      <Row className="justify-content-center align-items-center">
        <Paper
          className="mb-3 p-3"
          sx={{ width: "100vh", overflow: "hidden", overflowX: "auto" }}
        >
          <Form>
            <Stack gap={3}>
              <Row>
                <Col>
                  <FormControl fullWidth>
                    <InputLabel id="label-bahanbaku">Bahan Baku</InputLabel>
                    <Select
                      disabled={!isFilling}
                      labelId="label-bahanbaku"
                      label="Bahan Baku"
                      value={data.id_bahanBaku}
                      name="id_bahanBaku"
                      onChange={handleChange}
                    >
                      {bahanbaku.map((bahanbaku) => (
                        <MenuItem key={bahanbaku.id} value={bahanbaku.id}>
                          {bahanbaku.nama}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
                <Col>
                  <TextField
                    fullWidth
                    label="Jumlah"
                    name="jumlah"
                    variant="outlined"
                    color="primary"
                    value={data.jumlah}
                    disabled={!isFilling}
                    onChange={handleChange}
                    InputProps={{ inputComponent: NumberFormat }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Tanggal Pembelian"
                      name="tglPembelian"
                      disabled={!isFilling}
                      onChange={(newValue) => {
                        const formattedDate = newValue.format("YYYY-MM-DD");
                        setData({
                          ...data,
                          tglPembelian: formattedDate,
                        });
                      }}
                      value={dayjs(data.tglPembelian)}
                      className="w-100"
                    />
                  </LocalizationProvider>
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
                    InputProps={{ inputComponent: MoneyFormat }}
                  />
                </Col>
              </Row>
              <Stack direction="horizontal" gap={3}>
                {isAddDisabled ? (
                  <Button
                    style={{ width: "100px" }}
                    className="flex-grow-1"
                    size="lg"
                    variant="success"
                    onClick={submitData}
                    disabled={
                      (typeof data.jumlah === "string"
                        ? data.jumlah.trim() === ""
                        : data.jumlah === "") ||
                      (typeof data.id_bahanBaku === "string"
                        ? data.id_bahanBaku.trim() === ""
                        : data.id_bahanBaku === "") ||
                      (typeof data.harga === "string"
                        ? data.harga.trim() === ""
                        : data.harga === "") ||
                      data.tglPembelian.trim() === ""
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
                    isFilling
                      ? () => clearAll()
                      : () => handleShowModal("Hapus")
                  }
                  disabled={isDelDisabled}
                >
                  {isFilling ? "Batal" : "Hapus"}
                </Button>
              </Stack>
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
        ) : pembelianBahanBaku?.length > 0 ? (
          <CustomTable
            tableHeader={tableHeader}
            data={pembelianBahanBaku}
            handleRowClick={handleRowClick}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <Alert variant="secondary" className="mt-3 text-center">
              Belum Ada Pembelian Bahan Baku....
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

export default PembelianBahanBaku;
