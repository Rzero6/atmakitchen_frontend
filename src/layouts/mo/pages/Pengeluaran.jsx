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
  CreatePengeluaranLain,
  DeletePengeluaranLain,
  GetAllPengeluaranLain,
  UpdatePengeluaranLain,
} from "../../../api/apiPengeluaranLain";
import CustomTable from "../../../components/CustomTable";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { MoneyFormat } from "../../../components/NumericFormat";

export const tableHeader = [
  { id: "rincian", label: "Rincian", minWidth: 300 },
  {
    id: "nominal",
    label: "Nominal",
    minWidth: 100,
    format: (value) => `Rp. ${value.toLocaleString("id-ID")}`,
  },
  { id: "tanggal_pengeluaran", label: "Tanggal Pengeluaran", minWidth: 100 },
];

const PengeluaranLain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [pengeluaranLain, setPengeluaranLain] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  const [data, setData] = useState({
    rincian: "",
    nominal: "",
    tanggal_pengeluaran: dayjs().format("YYYY-MM-DD"),
  });
  const handleChange = (event) => {
    if (event.target.name === "nominal" && isNaN(event.target.value)) return;
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleRowClick = (row) => {
    clearAll();
    setSelectedRow(row);
    setIsEditDisabled(false);
    setIsDelDisabled(false);
    setData(row);
  };
  const fetchPengeluaranLain = () => {
    setIsLoading(true);
    GetAllPengeluaranLain()
      .then((response) => {
        const formattedResponse = response.map((item) => ({
          ...item,
          tanggal_pengeluaran: dayjs(item.tanggal_pengeluaran).format(
            "DD MMM YYYY"
          ),
        }));
        setPengeluaranLain(formattedResponse);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPengeluaranLain();
  }, []);

  const clearAll = () => {
    setData({
      rincian: "",
      nominal: "",
      tanggal_pengeluaran: dayjs().format("YYYY-MM-DD"),
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
    DeletePengeluaranLain(id)
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
    fetchPengeluaranLain();
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);
    setIsDelDisabled(true);
    if (selectedRow) {
      UpdatePengeluaranLain(data)
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
          fetchPengeluaranLain();
        });
    } else {
      const formData = new FormData();
      formData.append("rincian", data.rincian);
      formData.append("nominal", data.nominal);
      formData.append("tanggal_pengeluaran", data.tanggal_pengeluaran);
      CreatePengeluaranLain(formData)
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
          fetchPengeluaranLain();
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
        <h1 className="h4 fw-bold mb-0 text-nowrap">PengeluaranLain</h1>
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
              <Row>
                <Col>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="en-gb"
                  >
                    <DatePicker
                      label="Tanggal Pengeluaran"
                      name="tanggal_pengeluaran"
                      disabled={!isFilling}
                      onChange={(newValue) => {
                        const formattedDate = newValue.format("YYYY-MM-DD");
                        setData({
                          ...data,
                          tanggal_pengeluaran: formattedDate,
                        });
                      }}
                      value={dayjs(data.tanggal_pengeluaran)}
                      className="w-100"
                    />
                  </LocalizationProvider>
                </Col>
                <Col>
                  <TextField
                    fullWidth
                    label="Nominal"
                    name="nominal"
                    variant="outlined"
                    color="primary"
                    value={data.nominal}
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
                      data.rincian.trim() === "" ||
                      (typeof data.nominal === "string"
                        ? data.nominal.trim() === ""
                        : data.nominal === "") ||
                      data.tanggal_pengeluaran.trim() === ""
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
        ) : pengeluaranLain?.length > 0 ? (
          <CustomTable
            tableHeader={tableHeader}
            data={pengeluaranLain}
            handleRowClick={handleRowClick}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <Alert variant="secondary" className="mt-3 text-center">
              Belum ada Pengeluaran Lain....
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

export default PengeluaranLain;
