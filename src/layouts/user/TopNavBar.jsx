import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { GetCustomerById } from "../../api/apiCustomer";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import { Menu, MenuItem, Divider, AppBar } from "@mui/material";
import { getProfilPic } from "../../api";

const TopNavbar = ({ routes }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("token");
  const [user, setUser] = useState(
    isLoggedIn ? JSON.parse(sessionStorage.getItem("user")) : null
  );
  const [customer, setCustomer] = useState([]);
  const [show, setShow] = useState(false);
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("customer");
    handleCloseModal();
    navigate("/");
  };
  const login = () => {
    navigate("/login");
  };
  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => {
    handleClose();
    setShow(true);
  };
  const fetchCustomer = () => {
    GetCustomerById(user.id)
      .then((response) => {
        setCustomer(response);
        sessionStorage.setItem("customer", JSON.stringify(response));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchCustomer();
    }
  }, []);
  return (
    <Navbar
      bg="primary"
      data-bs-theme="dark"
      fixed="top"
      collapseOnSelect
      expand="sm"
    >
      <>
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
          tabIndex={0}
          className="ms-3"
        >
          <Image
            src="https://i.pinimg.com/originals/05/71/be/0571be92d64742ac3fec3230a723d0a8.jpg"
            width={50}
            height={50}
            alt="Logo"
          />{" "}
          Atma Kitchen
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="me-3" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {routes?.map((route, index) => (
              <Nav.Link key={index} onClick={() => navigate(route.path)}>
                <Button variant="primary" className="w-100">
                  {route.name}
                </Button>
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="me-3">
            {isLoggedIn ? (
              <div>
                <Nav.Link onClick={handleClick}>
                  {customer.profil_pic ? (
                    <Avatar
                      alt="profile picture"
                      src={getProfilPic(customer.profil_pic)}
                    ></Avatar>
                  ) : (
                    <Avatar {...stringAvatar(user.nama)}></Avatar>
                  )}
                </Nav.Link>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <p className="text-center">
                    Hello <strong>{user.nama}!</strong>
                  </p>
                  <Divider></Divider>
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profil
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/riwayat-pesanan")}>
                    Riwayat Pesanan
                  </MenuItem>
                  <MenuItem onClick={handleShowModal}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <Nav.Link onClick={login}>
                <Button variant="success" className="w-100">
                  Log In
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </>

      <Modal centered show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apakah Anda yakin ingin logout ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name) {
  if (!name) return null;
  name = name.trim();

  const nameParts = name.split(" ");
  let initials = "";

  if (nameParts.length > 1) {
    initials += nameParts[0][0] + nameParts[nameParts.length - 1][0];
  } else {
    initials = nameParts[0][0];
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

export default TopNavbar;
