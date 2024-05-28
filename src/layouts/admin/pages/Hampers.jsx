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
  CreateDetailHampers,
  CreateHampers,
  DeleteAllDetailHampers,
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
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import { MoneyFormat, NumberFormat } from "../../../components/NumericFormat";
import { GetAllProduk } from "../../../api/apiProduk";
import { getImageHampers } from "../../../api";
import { GetAllBahanBaku } from "../../../api/apiBahanBaku";

export const tableHeader = [
  { id: "nama", label: "Nama", minWidth: 150 },

  {
    id: "harga",
    label: "Harga",
    minWidth: 40,
    format: (value) => `Rp. ${value.toLocaleString("id-ID")}`,
  },
];

const Hampers = () => {
  const imagePlaceHolder =
    "https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg";
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [hampers, setHampers] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [produk, setProduk] = useState([]);
  const [bahanBaku, setBahanBaku] = useState([]);
  const [produkMap, setProdukMap] = useState([]);
  const [bahanBakuMap, setBahanBakuMap] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  const [isSaveModal, setIsSaveModal] = useState(true);
  const [dataHampers, setDataHampers] = useState({
    nama: "",
    harga: "",
    image: "",
  });
  const [dataDetailHampers, setDataDetailHampers] = useState({
    id_produk: "",
    id_bahan_baku: "",
    jumlah: 1,
  });
  const [detailHampers, setDetailHampers] = useState([]);
  const [isIsi, setIsIsi] = useState(true);

  const handleChangeHampers = (event) => {
    setDataHampers({ ...dataHampers, [event.target.name]: event.target.value });
  };
  const handleChangeDetailHampers = (event) => {
    if (event.target.name === "id_produk") {
      setDataDetailHampers({
        ...dataDetailHampers,
        [event.target.name]: event.target.value,
        id_bahan_baku: null,
      });
    } else if (event.target.name === "id_bahan_baku") {
      setDataDetailHampers({
        ...dataDetailHampers,
        [event.target.name]: event.target.value,
        id_produk: null,
      });
    } else {
      setDataDetailHampers({
        ...dataDetailHampers,
        [event.target.name]: event.target.value,
      });
    }
  };
  const handleChangeIsi = (event) => {
    setIsIsi(!isIsi);
    if (isIsi)
      setDataDetailHampers({ ...detailHampers, id_bahan_baku: "", jumlah: 1 });
    else setDataDetailHampers({ ...detailHampers, id_produk: "", jumlah: 1 });
  };
  const handleAddDetailHampers = () => {
    setDetailHampers((prevDetailHampers) => {
      const isDuplicate = prevDetailHampers.some((item) => {
        return (
          item.id_produk === dataDetailHampers.id_produk &&
          item.id_bahan_baku === dataDetailHampers.id_bahan_baku
        );
      });

      if (isDuplicate) {
        return prevDetailHampers.map((item) =>
          item.id_produk === dataDetailHampers.id_produk &&
          item.id_bahan_baku === dataDetailHampers.id_bahan_baku
            ? dataDetailHampers
            : item
        );
      } else {
        return [...prevDetailHampers, dataDetailHampers];
      }
    });
  };

  const handleThumbnail = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const handleRowClick = (row) => {
    clearAll();
    setSelectedRow(row);
    const selectedHamper = hampers.find((hamper) => hamper.id === row.id);
    if (selectedHamper) setDetailHampers(selectedHamper.detail_hampers);
    setIsEditDisabled(false);
    setIsDelDisabled(false);
    setDataHampers(row);
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
  //FETCH PRODUK
  const fetchProduk = () => {
    GetAllProduk()
      .then((response) => {
        const produksMap = {};
        setProduk(response);
        response.forEach((produk) => {
          produkMap[produk.id] = produk;
        });
        setProdukMap(produksMap);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Fetch Bahan Baku
  const fetchBahanBaku = () => {
    GetAllBahanBaku()
      .then((response) => {
        const filteredResponse = response.filter((item) => item.packaging);
        const bahanBakusMap = {};
        setBahanBaku(filteredResponse);
        filteredResponse.forEach((bahanBaku) => {
          bahanBakusMap[bahanBaku.id] = bahanBaku;
        });
        setBahanBakuMap(bahanBakusMap);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchBahanBaku();
    fetchProduk();
    fetchHampers();
  }, []);

  const clearAll = () => {
    setThumbnail(null);
    setDataHampers({
      nama: "",
      harga: "",
      image: "",
    });
    setDataDetailHampers({
      id_produk: "",
      id_bahan_baku: "",
      jumlah: 1,
    });
    setDetailHampers([]);
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
  const handleClickChip = (item) => {
    if (item.id_produk === null) {
      setIsIsi(false);
      setDataDetailHampers(item);
    } else {
      setIsIsi(true);
      setDataDetailHampers(item);
    }
  };
  const handleDeleteChip = (targetIndex) => {
    const newArrayDetHam = detailHampers.filter(
      (item, index) => index !== targetIndex
    );
    setDetailHampers(newArrayDetHam);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    clearAll();
    fetchHampers();
  };

  const submitData = (event) => {
    event.preventDefault();
    setShowModal(false);
    setIsPending(true);
    setIsDelDisabled(true);
    if (selectedRow) {
      UpdateHampers(dataHampers)
        .then((response) => {
          submitDetailHampers(response.data.id);
        })
        .catch((err) => {
          console.log(err);
          toast.error(JSON.stringify(err.message));
          setIsPending(false);
        });
    } else {
      const formData = new FormData();

      formData.append("nama", dataHampers.nama);
      formData.append("harga", dataHampers.harga);
      formData.append("image", thumbnail);

      CreateHampers(formData)
        .then((response) => {
          submitDetailHampers(response.data.id);
        })
        .catch((err) => {
          console.log(err);
          if (err.message.image[0]) toast.error("Masukan gambar!");
          else toast.error(JSON.stringify(err.message));
          setIsPending(false);
        });
    }
  };
  const submitDetailHampers = (idHampers) => {
    setIsPending(true);
    DeleteAllDetailHampers(idHampers)
      .then(() => {
        const createPromises = detailHampers.map((detail) => {
          const formData = new FormData();
          formData.append("id_hampers", idHampers);
          if (detail.id_produk !== null) {
            formData.append("id_produk", detail.id_produk);
          } else {
            formData.append("id_bahan_baku", detail.id_bahan_baku);
          }
          formData.append("jumlah", detail.jumlah);

          return CreateDetailHampers(formData)
            .then((response) => {
              toast.success(response.message);
            })
            .catch((err) => {
              console.log(err);
              toast.error(JSON.stringify(err.message));
            });
        });

        Promise.all(createPromises)
          .then(() => {
            setIsPending(false);
            clearAll();
            fetchHampers();
          })
          .catch((err) => {
            setIsPending(false);
            console.log(err);
            toast.error(JSON.stringify(err.message));
          });
      })
      .catch((err) => {
        setIsPending(false);
        console.log(err);
        toast.error(JSON.stringify(err.message));
      });
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
                  style={{ aspectRatio: "16 / 11.4" }}
                >
                  {thumbnail ? (
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <img
                      src={
                        dataHampers.image
                          ? getImageHampers(dataHampers.image)
                          : imagePlaceHolder
                      }
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
                <Row className="mb-3">
                  <Col>
                    <TextField
                      fullWidth
                      label="Nama"
                      name="nama"
                      variant="outlined"
                      color="primary"
                      value={dataHampers.nama}
                      disabled={!isFilling}
                      onChange={handleChangeHampers}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <TextField
                      fullWidth
                      label="Harga"
                      name="harga"
                      variant="outlined"
                      color="primary"
                      value={dataHampers.harga}
                      disabled={!isFilling}
                      onChange={handleChangeHampers}
                      InputProps={{ inputComponent: MoneyFormat }}
                    />
                  </Col>
                </Row>
                <Stack
                  direction="horizontal"
                  gap={3}
                  className="mb-2 justify-content-center"
                >
                  <p className="h4 fw-bold mb-0 text-nowrap">Isi</p>
                  <hr className="border-top border-dark border-3 opacity-100 w-100" />
                  <FormControlLabel
                    disabled={!isFilling}
                    value={isIsi}
                    control={
                      <Switch
                        color="primary"
                        onChange={handleChangeIsi}
                        checked={isIsi}
                      />
                    }
                    label={isIsi ? "Produk" : "Packaging"}
                    labelPlacement="start"
                  />
                </Stack>
                <Row className="mb-3">
                  <Col>
                    {isIsi ? (
                      <FormControl fullWidth>
                        <InputLabel id="id_produk">Produk</InputLabel>
                        <Select
                          disabled={!isFilling}
                          labelId="id_produk"
                          label="id_produk"
                          value={dataDetailHampers.id_produk}
                          name="id_produk"
                          onChange={handleChangeDetailHampers}
                        >
                          {produk.map((produk) => (
                            <MenuItem key={produk.id} value={produk.id}>
                              {produk.nama + " " + produk.ukuran}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <FormControl fullWidth>
                        <InputLabel id="id_bahan_baku">Packaging</InputLabel>
                        <Select
                          disabled={!isFilling}
                          labelId="id_bahan_baku"
                          label="id_bahan_baku"
                          value={dataDetailHampers.id_bahan_baku}
                          name="id_bahan_baku"
                          onChange={handleChangeDetailHampers}
                        >
                          {bahanBaku.map((bahan) => (
                            <MenuItem key={bahan.id} value={bahan.id}>
                              {bahan.nama}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextField
                      fullWidth
                      label="Jumlah"
                      name="jumlah"
                      variant="outlined"
                      color="primary"
                      value={dataDetailHampers.jumlah}
                      disabled={!isFilling}
                      onChange={handleChangeDetailHampers}
                      InputProps={{ inputComponent: NumberFormat }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            {(isFilling || selectedRow !== null) && (
              <>
                <Button
                  disabled={
                    dataDetailHampers.jumlah === "" ||
                    isNaN(dataDetailHampers.jumlah) ||
                    dataDetailHampers.jumlah === "0" ||
                    dataDetailHampers.id_bahan_baku === "" ||
                    dataDetailHampers.id_produk === "" ||
                    !isFilling ||
                    isPending
                  }
                  className="w-100 my-3"
                  onClick={handleAddDetailHampers}
                >
                  Tambahkan Isi
                </Button>
                <Paper className="p-3">
                  {detailHampers.length > 0 ? (
                    detailHampers.map((item, index) => {
                      let adata = null;
                      if (item.id_produk !== null) {
                        adata = produk.find((p) => p.id === item.id_produk);
                      } else if (item.id_bahan_baku !== null) {
                        adata = bahanBaku.find(
                          (b) => b.id === item.id_bahan_baku
                        );
                      }

                      return (
                        <Chip
                          className="m-1"
                          key={index}
                          disabled={!isFilling || isPending}
                          label={
                            <span>
                              <strong>
                                {adata.nama}
                                {item.id_produk !== null && adata.ukuran
                                  ? " " + adata.ukuran
                                  : ""}
                              </strong>
                              {" : " + item.jumlah}
                            </span>
                          }
                          onClick={() => handleClickChip(item)}
                          onDelete={() => handleDeleteChip(index)}
                        />
                      );
                    })
                  ) : (
                    <Alert variant="danger" className="w-100 text-center">
                      Tambahkan Isi Hampers
                    </Alert>
                  )}
                </Paper>
              </>
            )}
            <Stack direction="horizontal" className="mt-3" gap={3}>
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
                    dataHampers.nama.trim() === "" ||
                    (typeof dataHampers.harga === "string"
                      ? dataHampers.harga.trim() === ""
                      : dataHampers.harga === "") ||
                    detailHampers.length < 1 ||
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
            data={hampers.map(({ detail_hampers, ...rest }) => rest)}
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

export default Hampers;
