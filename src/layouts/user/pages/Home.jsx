import {
  Carousel,
  Container,
  Image,
  Row,
  Col,
  Card,
  Stack,
} from "react-bootstrap";
import Footer from "../Footer";
import logo from "../../../assets/UAJY-LOGOGRAM.png";
import { LoremIpsum } from "react-lorem-ipsum";
import { useState } from "react";
import { Skeleton } from "@mui/material";
import image from "../../../assets/pastry.jpg";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };
  return (
    <div style={{ overflowX: "hidden" }}>
      <Carousel className="mt-1" style={{ width: "100%", height: "60vh" }}>
        <Carousel.Item>
          <Image
            style={{ objectFit: "cover", width: "100%", height: "60vh" }}
            fluid
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Korb_mit_Br%C3%B6tchen.JPG/1280px-Korb_mit_Br%C3%B6tchen.JPG"
            text="First slide"
          />
          <Carousel.Caption className="bg-black bg-opacity-50 rounded-2">
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image
            style={{ objectFit: "cover", width: "100%", height: "60vh" }}
            fluid
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Korb_mit_Br%C3%B6tchen.JPG/1280px-Korb_mit_Br%C3%B6tchen.JPG"
            text="Second slide"
          />
          <Carousel.Caption className="bg-black bg-opacity-50 rounded-2">
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image
            style={{ objectFit: "cover", width: "100%", height: "60vh" }}
            fluid
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Korb_mit_Br%C3%B6tchen.JPG/1280px-Korb_mit_Br%C3%B6tchen.JPG"
            text="Third slide"
          />
          <Carousel.Caption className="bg-black bg-opacity-50 rounded-2">
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Row className="justify-content-center">
        <Row className="p-3 justify-content-center">
          <Image style={{ width: "10%" }} src={logo} />
          <h2 className="text-center m-1">
            <strong>Atma Kitchen</strong>
          </h2>
        </Row>
      </Row>
      <Stack gap={2} className="mx-auto" style={{ width: "100%" }}>
        <Row style={{ maxWidth: "50%", margin: "0 auto" }}>
          <Col>
            <LoremIpsum
              p={1}
              avgWordsPerSentence={10}
              avgSentencesPerParagraph={10}
            />
          </Col>
        </Row>
        <Row
          className="p-3 justify-content-center"
          style={{ maxWidth: "50%", margin: "0 auto" }}
        >
          <h3>Misi kami</h3>
          <Col className="d-flex justify-content-center">
            <LoremIpsum
              p={1}
              avgWordsPerSentence={8}
              avgSentencesPerParagraph={8}
            />
          </Col>
          <Col md={6} className="d-flex justify-content-end align-items-start">
            <Card>
              {loading && (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width="100%"
                  height={350}
                />
              )}
              <Image
                className={`shadow shadow-lg border border-3 ${
                  loading ? "d-none" : "d-block"
                }`}
                src={image}
                alt="Image"
                onLoad={handleImageLoad}
                style={{ display: loading ? "none" : "block" }}
              />
            </Card>
          </Col>
        </Row>
        <Row
          className="p-3 justify-content-center"
          style={{ maxWidth: "50%", margin: "0 auto" }}
        >
          <h3 className="text-end">Visi kami</h3>
          <Col md={6} className="d-flex justify-content-end align-items-start">
            <Card>
              {loading && (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width="100%"
                  height={350}
                />
              )}
              <Image
                className={`shadow shadow-lg border border-3 ${
                  loading ? "d-none" : "d-block"
                }`}
                src={image}
                alt="Image"
                onLoad={handleImageLoad}
                style={{ display: loading ? "none" : "block" }}
              />
            </Card>
          </Col>
          <Col>
            <LoremIpsum
              p={3}
              avgWordsPerSentence={6}
              avgSentencesPerParagraph={4}
            />
          </Col>
        </Row>
      </Stack>

      <Footer />
    </div>
  );
};

export default Home;
