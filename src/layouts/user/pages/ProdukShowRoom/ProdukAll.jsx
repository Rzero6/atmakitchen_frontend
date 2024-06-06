import React, { useEffect, useState } from "react";
import { Col, Row, Card, Button, Modal, Form } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";

import { getImageProduk } from "../../../../api";
import { GetAllTransaksi } from "../../../../api/apiTransaksi";

const ProdukAll = ({
  produk,
  searchQuery,
  imagePlaceHolder,
  addToCart,
  user,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [jumlah, setJumlah] = useState("1");
  const [selectedDate, setSelectedDate] = useState(dayjs().add(3, "day")); // State for selected date
  const [error, setError] = useState("");
  const queryCategory = searchQuery.category.toLowerCase();
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
    let totalJumlah = 0;
    desiredTransaksi.forEach((trx) => {
      trx.detail.forEach((adetail) => {
        if (adetail.id_produk === produk.id) {
          totalJumlah += adetail.jumlah;
        }
      });
    });

    return totalJumlah;
  };
  const filteredProduk = produk.filter((produk) => {
    const matchesName = produk.nama
      .toLowerCase()
      .includes(searchQuery.query.toLowerCase());
    const matchesSize = produk.ukuran
      .toLowerCase()
      .includes(searchQuery.query.toLowerCase());
    const matchesPrice = produk.harga.toString().includes(searchQuery.query);
    const matchesCategory =
      queryCategory === "all" || produk.jenis.toLowerCase() === queryCategory;

    return (matchesName || matchesSize || matchesPrice) && matchesCategory;
  });

  const handleShowModal = (produk) => {
    setSelectedProduk(produk);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setJumlah("1");
    setSelectedDate(dayjs().add(3, "day")); // Reset to default today + 3 days
  };

  const handleAdtoCart = (produk, jumlah) => {
    addToCart(produk, null, jumlah);
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

  return (
    <>
      <Row>
        {filteredProduk.map((produk, index) => (
          <Col md={3} className="p-3" key={index}>
            <Card
              onClick={user !== null ? () => handleShowModal(produk) : () => {}}
              style={{ cursor: user !== null && "pointer" }}
            >
              <Card.Img
                className="border-bottom border-3"
                src={
                  produk.image === null
                    ? imagePlaceHolder
                    : getImageProduk(produk.image)
                }
                style={{
                  objectFit: "cover",
                  height: "200px",
                }}
              />
              <Card.Body className="p-3 d-flex flex-column justify-content-between">
                <p className="text-center customP">
                  <strong>{produk.nama}</strong>
                </p>
                <p className="text-center customP">{produk.ukuran}</p>
                <p className="text-end mt-3 customP">
                  {"Rp. " + produk.harga.toLocaleString("id-ID") + ",00"}
                </p>
                <p className="text-end customP">
                  {produk.id_penitip === null ? (
                    <span style={{ fontStyle: "italic" }}>Pre-order</span>
                  ) : (
                    "Stok " + produk.stok
                  )}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedProduk && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduk.nama}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={
                selectedProduk.image === null
                  ? imagePlaceHolder
                  : getImageProduk(selectedProduk.image)
              }
              alt={selectedProduk.nama}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "auto",
              }}
            />
            <div className="mt-1 mb-0">
              <strong>Harga: </strong>
              {"Rp. " + selectedProduk.harga.toLocaleString("id-ID") + ",00"}
            </div>

            <div className="mb-0">
              <strong>Ukuran: </strong>
              {selectedProduk.ukuran}
            </div>

            <div className="mb-0">
              {selectedProduk.id_penitip === null ? (
                <>
                  <span style={{ fontStyle: "italic" }}>Pre-order</span>
                  <div className="mb-3">
                    <strong>
                      Limit PO Tersisa: {selectedProduk.limit_po - countLimit()}{" "}
                    </strong>
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
                </>
              ) : (
                "Stok: " + selectedProduk.stok
              )}
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
                    // disabled={!isFilling}
                    // onChange={handleChange}
                    // InputProps={{ inputComponent: NumberFormat }}
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
              disabled={
                selectedProduk.limit_po === 0 &&
                selectedProduk.limit_po - countLimit() <= 0
              }
              onClick={() => handleAdtoCart(selectedProduk, jumlah)}
            >
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ProdukAll;
