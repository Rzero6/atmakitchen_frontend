import { Carousel, Container, Image } from "react-bootstrap";
import Footer from "../Footer";
const Home = () => {
  return (
    <>
      <Carousel className="mt-1" style={{ width: "100%", height: "60vh" }}>
        <Carousel.Item>
          <Image
            style={{ objectFit: "cover", width: "100%", height: "60vh" }}
            fluid
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Korb_mit_Br%C3%B6tchen.JPG/1280px-Korb_mit_Br%C3%B6tchen.JPG"
            text="First slide"
          />
          <Carousel.Caption>
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
          <Carousel.Caption>
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
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Footer />
    </>
  );
};

export default Home;
