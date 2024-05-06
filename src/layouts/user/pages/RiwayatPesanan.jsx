import React from "react";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Container,
  Stack,
  Button,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  TextField,
  Divider,
  Avatar,
  Card,
  Badge,
  Typography,
} from "@mui/material";
import { getProfilPic } from "../../../api";
import { MdOutlineEdit } from "react-icons/md";
import {
  NumberFormat,
  PhoneNumberFormat,
} from "../../../components/NumericFormat";
import dayjs from "dayjs";
import { GoVerified, GoUnverified } from "react-icons/go";
import { validate } from "react-email-validator";

const RiwayatPesanan = () => {
  const [isPending, setIsPending] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [pic, setPic] = useState(null);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [customer, setCustomer] = useState(
    JSON.parse(sessionStorage.getItem("customer"))
  );
  const handleChangeUser = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  const handleChangeCustomer = (event) => {
    setCustomer({ ...customer, [event.target.name]: event.target.value });
  };

  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => {
    setShow(true);
  };
  return (
    <Container className="p-4">
      <Card className="p-4">
        <Form className="mb-2">
          <Stack gap={3}>
            <Row>
              <Col>
                <Stack gap={3}>
                  <TextField
                    fullWidth
                    label="Nama"
                    name="nama"
                    variant="outlined"
                    color="primary"
                    value={user.nama}
                    InputProps={{
                      readOnly: !isFilling,
                    }}
                    onChange={handleChangeUser}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    variant="outlined"
                    color="primary"
                    value={user.email}
                    InputProps={{
                      readOnly: !isFilling,
                    }}
                    onChange={handleChangeUser}
                  />

                  <TextField
                    fullWidth
                    label="Nomor Telepon"
                    name="no_telepon"
                    variant="outlined"
                    color="primary"
                    value={user.no_telepon}
                    InputProps={{
                      inputComponent: PhoneNumberFormat,
                      readOnly: !isFilling,
                    }}
                    onChange={handleChangeUser}
                  />
                </Stack>
              </Col>
              <Col>
                <Stack gap={3}>
                  <TextField
                    fullWidth
                    label="Tanggal Lahir"
                    name="tanggal_lahir"
                    variant="outlined"
                    color="primary"
                    value={dayjs(customer.tanggal_lahir).format("D MMMM YYYY")}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Promo Poin"
                    name="promo_poin"
                    variant="outlined"
                    color="primary"
                    value={customer.promo_poin}
                    disabled
                    InputProps={{
                      inputComponent: NumberFormat,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Saldo"
                    name="saldo"
                    variant="outlined"
                    color="primary"
                    value={customer.saldo}
                    disabled
                    InputProps={{
                      inputComponent: NumberFormat,
                    }}
                  />
                </Stack>
              </Col>
            </Row>
            {isFilling ? (
              <Stack direction="horizontal" gap={3}>
                <Button
                  style={{ width: "100px" }}
                  className="flex-grow-1"
                  variant="success"
                  size="lg"
                  disabled={
                    user.nama.trim() === "" ||
                    !validate(user.email) ||
                    user.no_telepon.trim() === ""
                  }
                >
                  Simpan
                </Button>
                <Button
                  style={{ width: "100px" }}
                  className="flex-grow-1"
                  variant="danger"
                  onClick={() => setIsFilling(false)}
                  size="lg"
                >
                  Batal
                </Button>
              </Stack>
            ) : (
              <Stack direction="horizontal">
                <Button
                  style={{ width: "100px" }}
                  className="flex-grow-1"
                  variant="warning"
                  onClick={() => setIsFilling(true)}
                  size="lg"
                >
                  Edit
                </Button>
              </Stack>
            )}
          </Stack>
        </Form>
      </Card>
    </Container>
  );
};

export default RiwayatPesanan;
