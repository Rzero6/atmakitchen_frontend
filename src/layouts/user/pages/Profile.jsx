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

const Profile = () => {
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
  const handlePic = (event) => {
    setPic(event.target.files[0]);
  };
  return (
    <Container className="p-4">
      <Card className="p-4">
        <Form className="mb-2">
          <Stack gap={3}>
            <Row>
              <Col
                className="mb-2"
                xl={3}
                lg={4}
                md={5}
                sm={12}
                xs={12}
                style={{ display: "grid", placeItems: "center" }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  badgeContent={
                    <Button
                      size="sm"
                      variant="dark"
                      className="d-flex align-items-center"
                      onClick={handleShowModal}
                    >
                      <MdOutlineEdit size={20} className="me-2" />
                      Ubah Foto
                    </Button>
                  }
                >
                  {customer.profil_pic ? (
                    <Avatar
                      src={getProfilPic(customer.profil_pic)}
                      sx={{ width: "250px", height: "250px" }}
                    ></Avatar>
                  ) : (
                    <Avatar
                      style={{
                        width: "250px",
                        height: "250px",
                        fontSize: "160px",
                      }}
                      {...stringAvatar(user.nama)}
                    ></Avatar>
                  )}
                </Badge>
              </Col>
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
        {customer.email_verified_at ? (
          <>
            <span className="d-flex justify-content-end align-items-center">
              <strong style={{ fontSize: "20px" }}>Unverified</strong>
              <GoUnverified className="ms-2" size={25} color="red" />
            </span>
            <Alert variant="danger">
              Cek email anda untuk verifikasi akun.
            </Alert>
          </>
        ) : (
          <span className="d-flex justify-content-end align-items-center">
            <strong style={{ fontSize: "20px" }}>Verified</strong>
            <GoVerified className="ms-2" size={25} color="green" />
          </span>
        )}
      </Card>

      <Modal centered show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ganti Gambar Profil</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: "grid", placeItems: "center" }}>
          <Stack gap={3}>
            {pic ? (
              <Avatar
                src={URL.createObjectURL(pic)}
                sx={{ width: "250px", height: "250px" }}
              />
            ) : customer.profil_pic ? (
              <Avatar
                src={getProfilPic(customer.profil_pic)}
                sx={{ width: "250px", height: "250px" }}
              />
            ) : (
              <Avatar
                style={{
                  width: "250px",
                  height: "250px",
                  fontSize: "160px",
                }}
                {...stringAvatar(user.nama)}
              />
            )}
            <Button
              variant="secondary"
              onClick={() => document.getElementById("pic").click()}
            >
              Pilih dari perangkat
            </Button>
            <input
              type="file"
              name="pic"
              id="pic"
              className="d-none"
              onChange={handlePic}
              accept="image/*"
            />
          </Stack>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" disabled={!pic}>
            Simpan
          </Button>
          <Button variant="danger" onClick={handleCloseModal}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name) {
  if (!name) return null;
  name = name.trim();

  const nameParts = name.split(" ");
  let initials = "";

  if (nameParts.length > 1) {
    initials += nameParts[0][0] + nameParts[nameParts.length - 1][0];
  } else {
    initials = nameParts[0][0];
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}