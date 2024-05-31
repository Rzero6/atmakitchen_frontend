import React, { useEffect, useState } from "react";
import { Col, Row, Card, Stack, Modal, Button, Form } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { getImageHampers } from "../../../../api";
import { GetAllTransaksi } from "../../../../api/apiTransaksi";

const HampersAll = ({
  hampers,
  searchQuery,
  imagePlaceHolder,
  addToCart,
  user,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedHamper, setSelectedHamper] = useState(null);
  const [jumlah, setJumlah] = useState("1");
  const [selectedDate, setSelectedDate] = useState(dayjs().add(3, "day"));
  const [error, setError] = useState("");
  const [transaksi, setTransaksi] = useState([]);
  const fetchTransaksi = () => {
    GetAllTransaksi()
      .then((res) => setTransaksi(res))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchTransaksi();
  }, []);
  const countLimit = () => {
    const desiredTransaksi = transaksi.filter((trx) =>
      dayjs(trx.tanggal_penerimaan).isSame(dayjs(selectedDate))
    );
    let limit = 10;
    desiredTransaksi.forEach((trx) => {
      trx.detail.forEach((adetail) => {
        if (adetail.id_produk !== null) {
          const produk = adetail.produk;
          if (produk && typeof produk.limit_po === "number") {
            limit = Math.min(limit, produk.limit_po - trx.detail.length);
          }
        }
      });
    });

    return limit;
  };

  const handleShowModal = (hamper) => {
    setSelectedHamper(hamper);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHamper(null);
    setJumlah("1");
    setSelectedDate(dayjs().add(3, "day"));
  };

  const handleAddToCart = () => {
    if (jumlah === "" || parseInt(jumlah) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    addToCart({ ...selectedHamper, selectedDate, jumlah: parseInt(jumlah) });
    handleCloseModal();
  };

  const handleAdtoCart = (hamper, jumlah) => {
    addToCart(hamper, null, jumlah);
    handleCloseModal();
  };

  const handleJumlahChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setJumlah(value);
      setError("");
    } else {
      setError("Please enter a valid number.");
    }
  };

  const filteredHampers = hampers.filter((hamper) =>
    hamper.nama.toLowerCase().includes(searchQuery.query.toLowerCase())
  );

  return (
    <>
      {filteredHampers.length > 0 && (
        <Row>
          <Stack
            direction="horizontal"
            gap={3}
            className="my-3 justify-content-center"
          >
            <h1 className="h4 fw-bold mb-0 text-nowrap">Hampers</h1>
            <hr className="border-top border-dark border-3 opacity-100 w-100" />
          </Stack>
          {filteredHampers.map((hamper, index) => (
            <Col md={3} className="p-3" key={index}>
              <Card
                onClick={
                  user !== null ? () => handleShowModal(hamper) : () => {}
                }
                style={{ cursor: user !== null && "pointer" }}
              >
                <Card.Img
                  className="border-bottom border-3"
                  src={
                    hamper.image === null
                      ? imagePlaceHolder
                      : getImageHampers(hamper.image)
                  }
                  style={{
                    objectFit: "cover",
                    height: "200px",
                  }}
                />
                <Card.Body className="p-2 d-flex flex-column justify-content-between customP">
                  <p className="text-center customP">
                    <strong>{hamper.nama}</strong>
                  </p>
                  <p className="text-center customP">{hamper.rincian}</p>
                  <div className="px-3">
                    <p className="text-end mt-3 customP">
                      {"Rp. " + hamper.harga.toLocaleString("id-ID") + ",00"}
                    </p>
                    <p className="text-end">
                      <span style={{ fontStyle: "italic" }}>Pre-order</span>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedHamper && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedHamper.nama}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={
                selectedHamper.image === null
                  ? imagePlaceHolder
                  : getImageHampers(selectedHamper.image)
              }
              alt={selectedHamper.nama}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "auto",
              }}
            />
            <div className="mt-1 mb-0">
              <strong>Harga: </strong>
              {"Rp. " + selectedHamper.harga.toLocaleString("id-ID") + ",00"}
            </div>

            <div className="mb-0">
              <span style={{ fontStyle: "italic" }}>Pre-order</span>
              <div className="mb-3">
                <strong>Limit PO Tersisa: {countLimit()} </strong>
              </div>
              <div className="mb-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    minDate={dayjs().add(3, "day")}
                    label="Tanggal Pembelian"
                    name="tglPembelian"
                    onChange={(newValue) => setSelectedDate(newValue)}
                    value={selectedDate}
                    className="form-control"
                    renderInput={(params) => <input {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <div className="mt-2">
                <Form.Group>
                  <TextField
                    fullWidth
                    label="Jumlah"
                    name="jumlah"
                    variant="outlined"
                    color="primary"
                    value={jumlah}
                    onChange={handleJumlahChange}
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={countLimit() <= 0}
              onClick={() => handleAdtoCart(selectedHamper, jumlah)}
            >
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default HampersAll;
