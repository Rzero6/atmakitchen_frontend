import React from "react";
import { useState, useEffect } from "react";
import {
  Alert,
  Container,
  Row,
  Col,
  Button,
  Stack,
  Spinner,
  Form,
} from "react-bootstrap";
import Paper from "@mui/material/Paper";
import {
  GetAllKaryawan,
  UpdateGajiBonusKaryawan,
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
import { MoneyFormat } from "../../../components/NumericFormat";

export const tableHeader = [
  { id: "nama", label: "Nama", minWidth: 100 },
  { id: "jabatan", label: "Jabatan", minWidth: 100 },
  {
    id: "gaji_harian",
    label: "Gaji Harian",
    minWidth: 100,
    format: (value) => `Rp. ${value.toLocaleString("id-ID")}`,
  },
  {
    id: "bonus",
    label: "Bonus",
    minWidth: 50,
    format: (value) => `Rp. ${value.toLocaleString("id-ID")}`,
  },
];

const GajiBonus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [karyawan, setKaryawan] = useState([]);

  const [data, setData] = useState({
    id: "",
    gaji_harian: "",
    bonus: "",
    nama: "",
    jabatan: "",
  });
  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleRowClick = (row) => {
    clearAll();
    setSelectedRow(row);
    setIsEditDisabled(false);
    setData(row);
  };
  //FETCH KARYAWAN
  const fetchKaryawan = () => {
    GetAllKaryawan()
      .then((response) => {
        const karyawanFilled = response.map((karyawan) => ({
          ...karyawan,
          nama: karyawan.user.nama,
          jabatan: karyawan.user.role.nama,
        }));
        setKaryawan(karyawanFilled);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const clearAll = () => {
    setData({ id: "", gaji_harian: "", bonus: "", nama: "", jabatan: "" });
    setSelectedRow(null);
    setIsEditDisabled(true);
    setIsFilling(false);
  };

  const editData = () => {
    setIsFilling(true);
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);
    UpdateGajiBonusKaryawan(data)
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
                  <TextField
                    fullWidth
                    label="Nama"
                    name="nama"
                    variant="outlined"
                    color="primary"
                    value={data.nama}
                    disabled
                    onChange={handleChange}
                  />
                </Col>
                <Col>
                  <TextField
                    fullWidth
                    label="Jabatan"
                    name="jabatan"
                    variant="outlined"
                    color="primary"
                    value={data.jabatan}
                    disabled
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <TextField
                    fullWidth
                    label="Gaji Harian"
                    name="gaji_harian"
                    variant="outlined"
                    color="primary"
                    value={data.gaji_harian}
                    disabled={!isFilling}
                    onChange={handleChange}
                    InputProps={{ inputComponent: MoneyFormat }}
                  />
                </Col>
                <Col>
                  <TextField
                    fullWidth
                    label="Bonus"
                    name="bonus"
                    variant="outlined"
                    color="primary"
                    value={data.bonus}
                    disabled={!isFilling}
                    onChange={handleChange}
                    InputProps={{ inputComponent: MoneyFormat }}
                  />
                </Col>
              </Row>

              <Stack direction="horizontal" gap={3}>
                <Button
                  style={{ width: "100px" }}
                  className="flex-grow-1"
                  size="lg"
                  variant="success"
                  onClick={isFilling ? submitData : () => editData()}
                  disabled={
                    isEditDisabled ||
                    (data.gaji_harian === "") | (data.bonus === "") || isPending
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
                  ) : isFilling ? (
                    <span>Simpan</span>
                  ) : (
                    <span>Ubah</span>
                  )}
                </Button>
                {!isEditDisabled && (
                  <Button
                    style={{ width: "100px" }}
                    className="flex-grow-1"
                    size="lg"
                    variant="danger"
                    onClick={() => clearAll()}
                  >
                    Batal
                  </Button>
                )}
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
              Belum ada Data Gaji dan Bonus....
            </Alert>
          </div>
        )}
      </Row>
    </Container>
  );
};

export default GajiBonus;
