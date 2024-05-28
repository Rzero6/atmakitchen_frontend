import React from "react";
import { Col, Row, Card, Button } from "react-bootstrap";
import { getImageProduk } from "../../../../api";

const ProdukAll = ({ produk, searchQuery, imagePlaceHolder, addToCart }) => {
  const filteredProduk = produk.filter(
    (produk) =>
      produk.nama.toLowerCase().includes(searchQuery.query.toLowerCase()) ||
      produk.ukuran.toLowerCase().includes(searchQuery.query.toLowerCase()) ||
      produk.harga.toString().includes(searchQuery.query)
  );
  return (
    <Row>
      {filteredProduk.map((produk, index) => (
        <Col md={3} className="p-3" key={index}>
          <Card onClick={() => addToCart(produk)} style={{ cursor: "pointer" }}>
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
  );
};

export default ProdukAll;
