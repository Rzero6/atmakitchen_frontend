import React from "react";
import { Col, Row, Card, Stack } from "react-bootstrap";
import { getImageProduk } from "../../../../api";

const HampersAll = ({ hampers, searchQuery, imagePlaceHolder, addToCart }) => {
  const filteredHampers = hampers.filter((hamper) =>
    hamper.nama.toLowerCase().includes(searchQuery.query.toLowerCase())
  );

  return (
    filteredHampers.length > 0 && (
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
            <Card onClick={() => addToCart(hamper)} style={{ cursor: "pointer" }}>
              <Card.Img
                className="border-bottom border-3"
                src={
                  hamper.image === null
                    ? imagePlaceHolder
                    : getImageProduk(hamper.image)
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
    )
  );
};

export default HampersAll;
