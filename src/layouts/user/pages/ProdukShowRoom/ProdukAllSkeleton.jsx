import { Skeleton } from "@mui/material";
import { Col, Row } from "react-bootstrap";

const ProdukAllSkeleton = () => {
  return (
    <Row>
      {Array.from({ length: 16 }).map((_, index) => (
        <Col md={3} className="p-3" key={index}>
          <Skeleton variant="rounded" height={250} />
        </Col>
      ))}
    </Row>
  );
};

export default ProdukAllSkeleton;
