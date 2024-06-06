import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoremIpsum from "react-lorem-ipsum";
const Footer = () => {
  return (
    <>
      <footer className="bg-primary mt-5 bg-footer text-light">
        <div className="mx-3">
          <Row className="p-3">
            <Col>
              <h3>Tentang</h3>
              <LoremIpsum
                p={1}
                avgWordsPerSentence={6}
                avgSentencesPerParagraph={4}
              />
            </Col>

            <Col className="text-center">
              <h3>Link</h3>
              <ul className="list-unstyled">
                <li>
                  <a
                    className="text-decoration-none text-light fw-bold"
                    href="/"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    className="text-decoration-none text-light fw-bold"
                    href="/about"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    className="text-decoration-none text-light fw-bold"
                    href="/contact"
                  >
                    Kontak Kami
                  </a>
                </li>
              </ul>
            </Col>

            <Col className="text-end">
              <h3>Kontak</h3>
              <address>
                <p>
                  <i className="fa-solid fa-map-marker-alt"></i> Yogyakarta,
                  Jalan Babarsari 123
                </p>
                <p>
                  <i className="fa-solid fa-phone"></i> +1 (123) 456-7890
                </p>
                <p>
                  <i className="fa-solid fa-envelope"></i>{" "}
                  atma.kitchen.jaya@gmail.com
                </p>
              </address>
            </Col>
          </Row>
          <Row className="text-center">
            <p>&copy; {new Date().getFullYear()} Atma Kitchen</p>
            <ul className="list-inline">
              <li className="list-inline-item">
                <Link
                  to="https://policies.google.com/privacy?hl=en"
                  style={{ color: "white" }}
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  to="https://policies.google.com/terms?hl=en"
                  style={{ color: "white" }}
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </Row>
        </div>
      </footer>
    </>
  );
};

export default Footer;
