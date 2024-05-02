import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

const TopNavbar = ({ routes }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem("token");

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };
  const login = () => {
    navigate("/login");
  };

  return (
    <Navbar
      bg="primary"
      data-bs-theme="dark"
      fixed="top"
      collapseOnSelect
      expand="lg"
    >
      <Container>
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
          tabIndex={0}
        >
          <img
            src="https://i.pinimg.com/originals/05/71/be/0571be92d64742ac3fec3230a723d0a8.jpg"
            width={50}
            height={50}
            alt="Logo"
          />{" "}
          Atma Kitchen
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            {routes?.map((route, index) => (
              <Nav.Link key={index} onClick={() => navigate(route.path)}>
                <Button
                  variant={route.name === "Home" ? "primary" : "light"}
                  className="w-100"
                >
                  {route.name}
                </Button>
              </Nav.Link>
            ))}
            {isLoggedIn ? (
              <Nav.Link onClick={logout}>
                <Button variant="danger" className="w-100">
                  Log Out
                </Button>
              </Nav.Link>
            ) : (
              <Nav.Link onClick={login}>
                <Button variant="success" className="w-100">
                  Log In
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
