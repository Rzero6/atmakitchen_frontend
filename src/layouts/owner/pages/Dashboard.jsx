import React from "react";
import { useState } from "react";
import { Container,Stack,Spinner,Alert } from "react-bootstrap";

const DashboardOwner = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Container className="p-3">
      <Stack
        direction="horizontal"
        gap={3}
        className="mb-3 justify-content-center"
      >
        <h1 className="h4 fw-bold mb-0 text-nowrap">Dashboard</h1>
        <hr className="border-top border-dark border-3 opacity-100 w-50" />
      </Stack>
      {isLoading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <Alert variant="secondary" className="mt-3 text-center">
            Belum ada Data....
          </Alert>
        </div>
      )}
    </Container>
  );
};

export default DashboardOwner;
