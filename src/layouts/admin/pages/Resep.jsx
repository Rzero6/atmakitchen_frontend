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
  DeleteResepPerProduk,
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
  Chip,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import { MoneyFormat, NumberFormat } from "../../../components/NumericFormat";
import { GetAllBahanBaku } from "../../../api/apiBahanBaku";
import { GetAllProduk } from "../../../api/apiProduk";

export const tableHeader = [
  { id: "nama", label: "Produk", minWidth: 100 },
  { id: "ukuran", label: "Ukuran", minWidth: 100 },
  // { id: "status", label: "Status", minWidth: 100 },
];

const Resep = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [resep, setResep] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [produk, setProduk] = useState([]);
  const [bahanBaku, setBahanBaku] = useState([]);
  const [produkMap, setProdukMap] = useState([]);
  const [bahanBakuMap, setBahanBakuMap] = useState([]);
  const [isSaveModal, setIsSaveModal] = useState(true);
  const [selectedProdukResep, setSelectedProdukResep] = useState([]);

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
    setIsFilling(true);
    setSelectedRow(row);
    setSelectedProdukResep(resep.filter((resep) => resep.id_produk === row.id));
    setData({ ...data, id_produk: row.id });
  };

  const handleClickChip = (item) => {
    setData(item);
  };
  const handleDeleteChip = (targetIndex) => {
    const newArrayResep = selectedProdukResep.filter(
      (item, index) => index !== targetIndex
    );
    setSelectedProdukResep(newArrayResep);
  };
  //Fetch Resep
  const fetchResep = () => {
    GetAllResep()
      .then((response) => {
        setResep(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //FETCH PRODUK
  const fetchProduk = () => {
    setIsLoading(true);
    GetAllProduk()
      .then((response) => {
        const filteredProduks = response.filter(
          (produk) => produk.id_penitip === null
        );
        const produksMap = {};
        response.forEach((produk) => {
          produkMap[produk.id] = produk.nama;
        });
        const produkWithStatusResep = filteredProduks.map((produk) => {
          const count = resep.filter(
            (resep) => resep.id_produk === produk.id
          ).length;
          const status =
            count === 0 ? "Belum ada resep" : `Ada ${count} Bahan Baku`;
          return {
            ...produk,
            status: status,
          };
        });
        setProduk(produkWithStatusResep);
        setProdukMap(produksMap);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
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

  useEffect(() => {
    fetchBahanBaku();
    fetchResep();
    fetchProduk();
  }, []);

  const clearAll = () => {
    setData({ id_produk: "", id_bahan_baku: "", takaran: "" });
    setSelectedRow(null);
    setSelectedProdukResep([]);
    setIsFilling(false);
  };

  const addListResepData = () => {
    const index = selectedProdukResep.findIndex(
      (r) => r.id_bahan_baku === data.id_bahan_baku
    );
    if (index === -1) {
      selectedProdukResep.push(data);
    } else {
      const updatedSelectedProdukResep = [...selectedProdukResep];
      updatedSelectedProdukResep[index] = data;
      setSelectedProdukResep(updatedSelectedProdukResep);
    }
    setData({ ...data, takaran: "" });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    clearAll();
    fetchResep();
  };

  const submitData = (event) => {
    event.preventDefault();
    setShowModal(false);
    setIsPending(true);
    DeleteResepPerProduk(data.id_produk)
      .then(() => {
        selectedProdukResep.forEach((adata) => {
          const formData = new FormData();
          formData.append("id_produk", adata.id_produk);
          formData.append("id_bahan_baku", adata.id_bahan_baku);
          formData.append("takaran", adata.takaran);

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
            });
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(JSON.stringify(err.message));
      })
      .finally(() => {
        fetchBahanBaku();
        fetchResep();
        fetchProduk();
      });
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
        {isLoading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        ) : produk?.length > 0 ? (
          <>
            <CustomTable
              tableHeader={tableHeader}
              data={produk}
              handleRowClick={handleRowClick}
            />
            {selectedRow && (
              <Paper
                className="mt-3 p-3"
                sx={{ width: "100vh", overflow: "hidden", overflowX: "auto" }}
              >
                <Form>
                  <Stack gap={3}>
                    <Row>
                      <Col>
                        <FormControl fullWidth>
                          <InputLabel id="id_produk">Produk</InputLabel>
                          <Select
                            disabled
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
                    </Row>
                    <Row>
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
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {data.id_bahan_baku
                                  ? bahanBaku.find(
                                      (item) => item.id === data.id_bahan_baku
                                    ).satuan
                                  : ""}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Col>
                    </Row>

                    <Stack direction="horizontal" gap={3}>
                      <Button
                        style={{ width: "100px" }}
                        className="flex-grow-1"
                        size="lg"
                        variant="primary"
                        onClick={() => addListResepData()}
                        disabled={
                          data.id_produk === "" ||
                          data.id_bahan_baku === "" ||
                          data.takaran === "" ||
                          isPending
                        }
                      >
                        Tambah
                      </Button>
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
                          !isFilling || selectedProdukResep.length === 0
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

                      <Button
                        style={{ width: "100px" }}
                        className="flex-grow-1"
                        size="lg"
                        variant="danger"
                        onClick={() => {
                          setIsSaveModal(false);
                          setShowModal(true);
                        }}
                        disabled={!isFilling}
                      >
                        Batal
                      </Button>
                    </Stack>

                    <Paper className="p-3" elevation={3} color="gray">
                      {selectedProdukResep.length > 0 ? (
                        selectedProdukResep.map((item, index) => {
                          const bahan = bahanBaku.find(
                            (b) => b.id === item.id_bahan_baku
                          );
                          return (
                            <Chip
                              className="m-1"
                              key={index}
                              label={
                                <span>
                                  <strong>{bahan.nama}</strong>
                                  {" : " + item.takaran + " " + bahan.satuan}
                                </span>
                              }
                              onClick={() => handleClickChip(item)}
                              onDelete={() => handleDeleteChip(index)}
                            />
                          );
                        })
                      ) : (
                        <Chip
                          className="m-1"
                          label="Belum ada resep, tambahkan sesuatu"
                        />
                      )}
                    </Paper>
                  </Stack>
                </Form>
              </Paper>
            )}
          </>
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
              Konfirmasi <strong>{isSaveModal ? "Simpan" : "Batal"}</strong>{" "}
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
                onClick={isSaveModal ? submitData : handleCloseModal}
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
                onClick={() => setShowModal(false)}
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
