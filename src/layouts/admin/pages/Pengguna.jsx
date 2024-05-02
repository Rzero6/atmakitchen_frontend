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
  FormControl,
} from "react-bootstrap";
import Paper from "@mui/material/Paper";
import { GetAllCustomer } from "../../../api/apiCustomer";
import CustomTable from "../../../components/CustomTable";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";

export const tableHeader = [
  { id: "nama", label: "Nama", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  {
    id: "tanggal_lahir",
    label: "Tanggal Lahir",
    minWidth: 100,
  },
];

const Customer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState([]);

  const handleRowClick = () => {};
  const fetchCustomer = () => {
    setIsLoading(true);
    GetAllCustomer()
      .then((response) => {
        setCustomer(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Customer</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-50" />
      </Stack>
      {isLoading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : customer?.length > 0 ? (
        <Row className="justify-content-center align-items-center">
          <CustomTable
            tableHeader={tableHeader}
            data={customer}
            handleRowClick={handleRowClick}
          />
        </Row>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <Alert variant="secondary" className="mt-3 text-center">
            Belum ada Customer....
          </Alert>
        </div>
      )}
    </Container>
  );
};

export default Customer;
