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
  CreateResep,
  DeleteResep,
  GetAllResep,
  UpdateResep,
} from "../../../api/apiResep";
import CustomTable from "../../../components/CustomTable";
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { MoneyFormat, NumberFormat } from "../../../components/NumericFormat";
import { GetAllBahanBaku } from "../../../api/apiBahanBaku";
import { GetAllProduk } from "../../../api/apiProduk";

export const tableHeader = [
  { id: "nama_produk", label: "Produk", minWidth: 100 },
  { id: "nama_bb", label: "Bahan Baku", minWidth: 100 },
  { id: "takaran_satuan", label: "Takaran", minWidth: 50 },
];

const Resep = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [resep, setResep] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  const [produk, setProduk] = useState([]);
  const [bahanBaku, setBahanBaku] = useState([]);
  const [produkMap, setProdukMap] = useState([]);
  const [bahanBakuMap, setBahanBakuMap] = useState([]);

  const [data, setData] = useState({
    id_produk: "",
    id_bahan_baku: "",
    takaran: "",
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
  //FETCH PRODUK
  const fetchProduk = () => {
    GetAllProduk()
      .then((response) => {
        const produksMap = {};
        setProduk(response);
        response.forEach((produk) => {
          produkMap[produk.id] = produk.nama;
        });
        setProdukMap(produksMap);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //FETCH BAHANBAKU
  const fetchBahanBaku = () => {
    GetAllBahanBaku()
      .then((response) => {
        const bahanBakusMap = {};
        setBahanBaku(response);
        response.forEach((bahanBaku) => {
          bahanBakuMap[bahanBaku.id] = bahanBaku;
        });
        setBahanBakuMap(bahanBakusMap);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchResep = () => {
    setIsLoading(true);
    fetchBahanBaku();
    fetchProduk();
    GetAllResep()
      .then((response) => {
        const resepWithNamaPB = response.map((resep) => ({
          ...resep,
          nama_produk: produkMap[resep.id_produk],
          nama_bb: bahanBakuMap[resep.id_bahan_baku].nama,
          takaran_satuan: `${resep.takaran} ${
            bahanBakuMap[resep.id_bahan_baku].satuan
          }`,
        }));

        setResep(resepWithNamaPB);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchResep();
  }, []);

  const clearAll = () => {
    setData({ id_produk: "", id_bahan_baku: "", takaran: "" });
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
    DeleteResep(id)
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
    fetchResep();
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);
    setIsDelDisabled(true);
    if (selectedRow) {
      UpdateResep(data)
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
          fetchResep();
        });
    } else {
      const formData = new FormData();
      formData.append("id_produk", data.id_produk);
      formData.append("id_bahan_baku", data.id_bahan_baku);
      formData.append("takaran", data.takaran);

      CreateResep(formData)
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
          fetchResep();
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
        <h1 className="h4 fw-bold mb-0 text-nowrap">Resep</h1>
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
                    <InputLabel id="id_produk">Produk</InputLabel>
                    <Select
                      disabled={!isFilling}
                      labelId="id_produk"
                      label="ID Produk"
                      value={data.id_produk}
                      name="id_produk"
                      onChange={handleChange}
                    >
                      {produk.map((produk) => (
                        <MenuItem key={produk.id} value={produk.id}>
                          {produk.nama} {produk.ukuran}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
                <Col>
                  <FormControl fullWidth>
                    <InputLabel id="id_bahan_baku">Bahan Baku</InputLabel>
                    <Select
                      disabled={!isFilling}
                      labelId="id_bahan_baku"
                      label="ID Bahan Baku"
                      value={data.id_bahan_baku}
                      name="id_bahan_baku"
                      onChange={handleChange}
                    >
                      {bahanBaku.map((bahanBaku) => (
                        <MenuItem key={bahanBaku.id} value={bahanBaku.id}>
                          {bahanBaku.nama}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TextField
                    fullWidth
                    label="Takaran"
                    name="takaran"
                    variant="outlined"
                    color="primary"
                    value={data.takaran}
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
                    onClick={submitData}
                    disabled={
                      data.id_produk === "" ||
                      data.id_bahan_baku === "" ||
                      data.takaran === "" ||
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
        ) : resep?.length > 0 ? (
          <CustomTable
            tableHeader={tableHeader}
            data={resep}
            handleRowClick={handleRowClick}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <Alert variant="secondary" className="mt-3 text-center">
              Belum ada Resep....
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
              <Button
                variant="primary"
                onClick={() => delData(selectedRow.id)}
                disabled={isPending}
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

export default Resep;
