import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { MdLogout } from "react-icons/md";
import { MenuItem } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";

const LogoutConfirmation = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
    toast.success("Logged out");
    handleClose();
    navigate("/admin/login");
  };
  return (
    <>
      <MenuItem className="mt-5" icon={<MdLogout />} onClick={handleShow}>
        Logout
      </MenuItem>
      <Modal show={show} onHide={handleClose}>
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
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LogoutConfirmation;
