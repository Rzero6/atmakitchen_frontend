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
  CreateBahanBaku,
  DeleteBahanBaku,
  GetAllBahanBaku,
  UpdateBahanBaku,
} from "../../../api/apiBahanBaku";
import CustomTable from "../../../components/CustomTable";
import { TextField, FormControlLabel, Switch } from "@mui/material";
import { toast } from "react-toastify";
import { NumberFormat } from "../../../components/NumericFormat";

export const tableHeader = [
  { id: "nama", label: "Nama", minWidth: 250 },
  {
    id: "stok",
    label: "Stok",
    minWidth: 50,
    format: (value) => value.toLocaleString("id-ID"),
  },
  { id: "satuan", label: "Satuan", minWidth: 50 },
];

const BahanBaku = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [bahanBaku, setBahanBaku] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  const [isPackaging, setIsPackaging] = useState(false);
  const [isSaveModal, setIsSaveModal] = useState(true);
  const [data, setData] = useState({
    nama: "",
    stok: "",
    satuan: "",
    packaging: false,
  });
  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleRowClick = (row) => {
    clearAll();
    setSelectedRow(row);
    setIsPackaging(row.packaging === 1);
    setIsEditDisabled(false);
    setIsDelDisabled(false);
    setData(row);
  };
  const fetchBahanBaku = () => {
    setIsLoading(true);
    GetAllBahanBaku()
      .then((response) => {
        setBahanBaku(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBahanBaku();
  }, []);

  const clearAll = () => {
    setData({ nama: "", stok: "", satuan: "", packaging: false });
    setIsPackaging(false);
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
    DeleteBahanBaku(id)
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
  const handleCloseModal = () => {
    setShowModal(false);
    clearAll();
    fetchBahanBaku();
  };

  const submitData = (event) => {
    event.preventDefault();
    setShowModal(false);
    setIsPending(true);
    setIsDelDisabled(true);
    if (selectedRow) {
      setData({ ...data, packaging: isPackaging });
      console.log(data.packaging);
      UpdateBahanBaku(data)
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
          fetchBahanBaku();
        });
    } else {
      const formData = new FormData();
      formData.append("nama", data.nama);
      formData.append("stok", data.stok);
      formData.append("satuan", data.satuan);
      if (isPackaging) formData.append("packaging", 1);

      CreateBahanBaku(formData)
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
          fetchBahanBaku();
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
        <h1 className="h4 fw-bold mb-0 text-nowrap">BahanBaku</h1>
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
                <Col className="text-end">
                  <FormControlLabel
                    name="packaging"
                    value={isPackaging}
                    control={
                      <Switch
                        color="primary"
                        checked={isPackaging}
                        onChange={() => {
                          setIsPackaging(!isPackaging);
                        }}
                      />
                    }
                    label={isPackaging ? "Packaging" : "Bahan"}
                    disabled={!isFilling}
                    labelPlacement="start"
                  />
                </Col>
              </Row>
              <Row>
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
                <Col>
                  <TextField
                    fullWidth
                    label="Satuan"
                    name="satuan"
                    variant="outlined"
                    color="primary"
                    value={data.satuan}
                    disabled={!isFilling}
                    onChange={handleChange}
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
                    onClick={() => {
                      setIsSaveModal(true);
                      setShowModal(true);
                    }}
                    disabled={
                      data.nama.trim() === "" ||
                      (typeof data.stok === "string"
                        ? data.stok.trim() === ""
                        : data.stok === "") ||
                      data.satuan.trim() === "" ||
                      isPending
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
                      : () => {
                          setIsSaveModal(false);
                          setShowModal(true);
                        }
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
        ) : bahanBaku?.length > 0 ? (
          <CustomTable
            tableHeader={tableHeader}
            data={bahanBaku}
            handleRowClick={handleRowClick}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <Alert variant="secondary" className="mt-3 text-center">
              Belum ada BahanBaku....
            </Alert>
          </div>
        )}
      </Row>

      {/* Modal */}
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Konfirmasi <strong>{isSaveModal ? "Simpan" : "Hapus"}</strong>{" "}
              Data
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack
              direction="horizontal"
              gap={2}
              className="justify-content-end"
            >
              <Button
                variant="primary"
                disabled={isPending}
                onClick={
                  isSaveModal ? submitData : () => delData(selectedRow.id)
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

export default BahanBaku;
