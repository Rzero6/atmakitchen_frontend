import { useNavigate } from "react-router-dom";
import { Navbar, Stack, Nav, Button, Image } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { Modal } from "react-bootstrap";
import { GetCustomerById } from "../../api/apiCustomer";
import Avatar from "@mui/material/Avatar";
import { Menu, MenuItem, Divider, AppBar } from "@mui/material";
import { getProfilPic } from "../../api";
import Badge from "@mui/material/Badge";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../../assets/UAJY-LOGOGRAM.png";
import { GlobalStateContext } from "../../api/contextAPI";

const TopNavbar = ({ routes }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { cart, setCart } = useContext(GlobalStateContext);
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
    setCart([]);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("customer");
    sessionStorage.removeItem("cart");
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
          <Image className="p-1" src={logo} width={50} height={50} alt="Logo" />{" "}
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
              <Stack
                direction="horizontal"
                gap={2}
                className="d-flex justify-content-center align-items-center"
              >
                <Nav.Link onClick={() => navigate("/cart")}>
                  <Badge
                    badgeContent={cart.length}
                    color="secondary"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "yellow",
                        color: "black",
                      },
                    }}
                  >
                    <FaShoppingCart size={25} />
                  </Badge>
                </Nav.Link>
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
                  <p className="text-center p-3">
                    Hello <strong>{user.nama}!</strong>
                  </p>
                  <Divider></Divider>
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profil
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/pesanan")}>
                    Pesanan
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/saldo")}>
                    Tarik Saldo
                  </MenuItem>
                  <MenuItem onClick={handleShowModal}>Logout</MenuItem>
                </Menu>
              </Stack>
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
