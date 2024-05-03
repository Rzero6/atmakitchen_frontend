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
  CreateKaryawan,
  DeleteKaryawan,
  GetAllKaryawan,
  UpdateKaryawan,
} from "../../../api/apiKaryawan";
import CustomTable from "../../../components/CustomTable";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  MoneyFormat,
  NumberFormat,
  PhoneNumberFormat,
} from "../../../components/NumericFormat";
import { GetAllRole } from "../../../api/apiRole";

export const tableHeader = [
  { id: "jabatan", label: "Jabatan", minWidth: 100 },
  { id: "nama", label: "Nama", minWidth: 200 },
  {
    id: "email",
    label: "Email",
    minWidth: 100,
  },
  {
    id: "no_telepon",
    label: "Nomor Telepon",
    minWidth: 100,
    format: (value) => {
      let formattedValue = value.replace(/(.{4})/g, "$1-");
      if (formattedValue.endsWith("-")) {
        formattedValue = formattedValue.slice(0, -1);
      }
      return formattedValue;
    },
  },
];

const Karyawan = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [karyawan, setKaryawan] = useState([]);
  const [role, setRole] = useState([]);
  const [roleMap, setRoleMap] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  const [data, setData] = useState({
    nama: "",
    email: "",
    no_telepon: "",
    id_role: "",
  });
  const handleChange = (event) => {
    if (event.target.name === "nama") {
      const formattedEmail = formatEmailFromName(event.target.value);
      setData({
        ...data,
        [event.target.name]: event.target.value,
        email: formattedEmail,
      });
    } else {
      setData({ ...data, [event.target.name]: event.target.value });
    }
  };

  const formatEmailFromName = (nama) => {
    const formattedName = nama.replace(/[^\w\s]/gi, "").replace(/\s/g, "");
    return formattedName.toLowerCase() + "@atmakitchen.com";
  };

  const handleRowClick = (row) => {
    clearAll();
    setSelectedRow(row);
    setIsEditDisabled(false);
    setIsDelDisabled(false);
    setData(row);
  };
  const fetchRoles = () => {
    GetAllRole()
      .then((response) => {
        const rolesMap = {};
        setRole(response);
        response.forEach((role) => {
          roleMap[role.id] = role.nama;
        });
        setRoleMap(rolesMap);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchKaryawan = () => {
    setIsLoading(true);
    fetchRoles();
    GetAllKaryawan()
      .then((response) => {
        const karyawanWithJabatan = response.map((karyawan) => ({
          ...karyawan,
          jabatan: roleMap[karyawan.id_role],
        }));
        const filteredKaryawanWithJabatan = karyawanWithJabatan.filter(
          (karyawan) => {
            return karyawan.jabatan !== "Owner";
          }
        );
        setKaryawan(filteredKaryawanWithJabatan);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        toast.err(err);
      });
  };

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const clearAll = () => {
    setData({ nama: "", email: "", id_role: "", no_telepon: "" });
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
    DeleteKaryawan(id)
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
    fetchKaryawan();
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);
    setIsDelDisabled(true);
    if (selectedRow) {
      UpdateKaryawan(data)
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
          fetchKaryawan();
        });
    } else {
      const formData = new FormData();
      formData.append("nama", data.nama);
      formData.append("email", data.email);
      formData.append("id_role", data.id_role);
      formData.append("no_telepon", data.no_telepon);
      CreateKaryawan(formData)
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
          fetchKaryawan();
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
        <h1 className="h4 fw-bold mb-0 text-nowrap">Karyawan</h1>
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
                  <FormControl fullWidth>
                    <InputLabel id="label-jabatan">Jabatan</InputLabel>
                    <Select
                      disabled={!isFilling}
                      labelId="label-jabatan"
                      label="Jabatan"
                      value={data.id_role}
                      name="id_role"
                      onChange={handleChange}
                    >
                      {role.map(
                        (role) =>
                          role.nama !== "Customer" &&
                          role.nama !== "Owner" && (
                            <MenuItem key={role.id} value={role.id}>
                              {role.nama}
                            </MenuItem>
                          )
                      )}
                    </Select>
                  </FormControl>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    variant="outlined"
                    color="primary"
                    value={data.email}
                    disabled
                  />
                </Col>
                <Col>
                  <TextField
                    fullWidth
                    label="Nomor Telepon"
                    name="no_telepon"
                    variant="outlined"
                    color="primary"
                    value={data.no_telepon}
                    InputProps={{ inputComponent: PhoneNumberFormat }}
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
                      data.nama.trim() === "" ||
                      (typeof data.id_role === "string"
                        ? data.id_role.trim() === ""
                        : data.id_role === "")
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
        ) : karyawan?.length > 0 ? (
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
              Belum ada Karyawan....
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

export default Karyawan;
