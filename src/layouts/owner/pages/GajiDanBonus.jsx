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
  GetAllKaryawan,
  updateGajiBonus,
} from "../../../api/apiKaryawan";
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
// import { GetAllBahanBaku } from "../../../api/apiBahanBaku";
// import { GetAllProduk } from "../../../api/apiProduk";

export const tableHeader = [
  { id: "id_user", label: "Karyawan", minWidth: 100 },
  { id: "gaji_harian", label: "Gaji Harian", minWidth: 100 },
  { id: "bonus", label: "Bonus", minWidth: 50 },
];

const GajiBonus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
//   const [resep, setResep] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  const [karyawan, setKaryawan] = useState([]);
  const [gajibonus, setGajiBonus] = useState([]);
  const [karyawanMap, setKaryawanMap] = useState([]);
  const [gajiBonusMap, setGajiBonusMap] = useState([]);

  const [data, setData] = useState({
    id_user: "",
    gaji_harian: "",
    bonus: "",
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
  //FETCH KARYAWAN
  const fetchKaryawan = () => {
    GetAllKaryawan()
      .then((response) => {
        const karyawanMap = {};
        setKaryawan(response);
        response.forEach((karyawan) => {
          karyawanMap[karyawan.id] = user.nama;
        });
        setKaryawanMap(karyawanMap);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
//   const fetchResep = () => {
//     setIsLoading(true);
//     fetchBahanBaku();
//     fetchProduk();
//     GetAllResep()
//       .then((response) => {
//         const resepWithNamaPB = response.map((resep) => ({
//           ...resep,
//           nama_produk: produkMap[resep.id_produk],
//           nama_bb: bahanBakuMap[resep.id_bahan_baku].nama,
//           takaran_satuan: `${resep.takaran} ${
//             bahanBakuMap[resep.id_bahan_baku].satuan
//           }`,
//         }));

//         setResep(resepWithNamaPB);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setIsLoading(false);
//       });
//   };

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const clearAll = () => {
    setData({ id_user: "", gaji_harian: "", bonus: "" });
    setSelectedRow(null);
    setIsAddDisabled(false);
    setIsDelDisabled(true);
    setIsEditDisabled(true);
    setIsFilling(false);
  };

  const editData = () => {
    setIsEditDisabled(true);
    setIsDelDisabled(false);
    setIsAddDisabled(true);
    setIsFilling(true);
  };

  

  const handleShowModal = (type) => {
    setShowModal(true);
    console.log("show");
    setModalType(type);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    clearAll();
    fetchKaryawan();
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);
    setIsDelDisabled(true);
    if (selectedRow) {
      updateGajiBonus(data)
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
      formData.append("gaji_harian", data.gaji_harian);
      formData.append("bonus", data.bonus);
    }
  };

  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Gaji dan Bonus</h1>
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
                    <InputLabel id="id_user">Karyawan</InputLabel>
                    <Select
                      disabled={!isFilling}
                      labelId="id_user"
                      label="ID User"
                      value={data.nama}
                      name="id_user"
                      onChange={handleChange}
                    >
                      {produk.map((id_user) => (
                        <MenuItem key={karyawan.id} value={user.nama}>
                          {user.id_role}
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
                      data.takaran === ""
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
            data={karyawan}
            handleRowClick={handleRowClick}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <Alert variant="secondary" className="mt-3 text-center">
              Belum ada Data Gaji dan Bonus....
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

export default GajiBonus;
