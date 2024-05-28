import React from "react";
import { Col, Row, Card } from "react-bootstrap";
import { getImageHampers } from "../../../../api";
import { getImageProduk } from "../../../../api";

const ProdukCategory = ({
  listCategory,
  searchQuery,
  setSearchQuery,
  imagePlaceHolder,
}) => {
  return (
    <Row>
      {listCategory.map((category, index) => (
        <Col md={3} className="p-3" key={index}>
          <Card
            onClick={() =>
              setSearchQuery({ ...searchQuery, category: category.jenis })
            }
            style={{
              height: "250px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                overflow: "hidden",
                height: "70%",
              }}
            >
              <Card.Img
                src={
                  category.image === null
                    ? imagePlaceHolder
                    : category.jenis === "hampers"
                    ? getImageHampers(category.image)
                    : getImageProduk(category.image)
                }
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <Card.Body style={{ height: "0px" }} className="text-center">
              {category.jenis}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProdukCategory;
