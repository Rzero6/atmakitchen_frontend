import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Stack,
} from "react-bootstrap";
import { IconButton, TextField } from "@mui/material";
import { FaTrash, FaPlus, FaMinus, FaImage } from "react-icons/fa";
import { GlobalStateContext } from "../../../../api/contextAPI";
import { useContext } from "react";
import { getImageHampers, getImageProduk } from "../../../../api";
import { FormControlLabel, Switch } from "@mui/material";
import {
  CreateDetailTransaksi,
  CreateTransaksi,
} from "../../../../api/apiTransaksi";
import { toast } from "react-toastify";
import { GetAllAlamat } from "../../../../api/apiAlamat";

const Cart = () => {
  const { cart, setCart } = useContext(GlobalStateContext);
  const [isPending, setIsPending] = useState(false);
  const [alamat, setAlamat] = useState([]);
  const [transaksi, setTransaksi] = useState({
    id_alamat: "",
    tanggal_penerimaan: "",
  });
  const [customer, setCustomer] = useState(
    JSON.parse(sessionStorage.getItem("customer"))
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState("");
  const [isFilling, setIsFilling] = useState(false);
  const [isDelivery, setIsDelivery] = useState(true);
  const handleChangeIsi = (event) => {
    setIsDelivery(!isDelivery);
  };

  const handleChangeAlamat = (event) => {
    setAlamat(event.target.value);
  };

  const fetchAlamat = () => {
    GetAllAlamat()
      .then((res) => {
        const filteredAlamat = res.filter(
          (alamat) => alamat.id_customer === customer.id
        );
        setAlamat(filteredAlamat);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchAlamat();
  }, []);

  const submitData = () => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("id_customer", customer.id);

    isDelivery && formData.append("id_alamat", transaksi.id_alamat);
    formData.append("tanggal_pesanan", transaksi.tanggal_penerimaan);

    CreateTransaksi(formData)
      .then((res) => {
        const idTransaksi = res.data.data.id;
        cart.forEach((element) => {
          const formDetail = new FormData();
          formDetail.append("id_transaksi", idTransaksi);
          element.produk === null
            ? formDetail.append("id_hampers", element.hampers.id)
            : formDetail.append("id_produk", element.produk.id);
          formDetail.append("jumlah", element.jumlah);

          CreateDetailTransaksi(formDetail)
            .then(() => {})
            .catch((err) => {
              console.log(err);
              toast.error(err.message);
            });
        });
        toast.success("Berhasil");
        setIsPending(false);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      });
  };

  const handleOrderClick = () => {
    setShowModal(true);
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };

  const handleModalSubmit = () => {
    if (deliveryOption === "pickup") {
      // Handle pickup
      setShowModal(false);
      // Redirect to payment or perform the necessary action
    } else if (deliveryOption === "delivery") {
      // Handle delivery
      setShowModal(false);
      // Show address input and then proceed to payment
    }
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedCart = cart.filter((_, i) => i !== deleteIndex);
    setCart(updatedCart);
    setShowDeleteModal(false);
  };

  const updateQuantity = (index, amount) => {
    const updatedCart = cart.map((item, i) => {
      if (i === index) {
        const newJumlah = parseInt(item.jumlah) + parseInt(amount);
        return { ...item, jumlah: newJumlah > 0 ? newJumlah : 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handleQuantityChange = (index, value) => {
    const updatedCart = cart.map((item, i) => {
      if (i === index) {
        const newJumlah = parseInt(value, 10);
        return { ...item, jumlah: newJumlah > 0 ? newJumlah : 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const subtotal =
    cart && cart.length > 0
      ? cart.reduce((total, item) => {
          const itemPrice = item.produk
            ? item.produk.harga
            : item.hampers
            ? item.hampers.harga
            : 0;
          return total + itemPrice * item.jumlah;
        }, 0)
      : 0;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          <h1>Cart</h1>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          {cart && cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={index} className="cart-item mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <div className="d-flex align-items-center mt-2">
                      {item.produk !== null ? (
                        item.produk.image ? (
                          <img
                            src={getImageProduk(item.produk.image)}
                            alt={item.id}
                            className="me-2"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <FaImage size={100} />
                        )
                      ) : item.hampers !== null ? (
                        item.hampers.image ? (
                          <img
                            src={getImageHampers(item.hampers.image)}
                            alt={item.id}
                            className="me-2"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <FaImage size={100} />
                        )
                      ) : (
                        <FaImage size={100} />
                      )}

                      <div className="ms-3">
                        <p>{item.produk.nama}</p>
                        <span>
                          {item.produk
                            ? "Rp" +
                              item.produk.harga.toLocaleString("id-ID") +
                              ",00"
                            : item.hampers
                            ? "Rp" +
                              item.hampers.harga.toLocaleString("id-ID") +
                              ",00"
                            : "Harga Tidak Tersedia"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <IconButton onClick={() => handleDeleteClick(index)}>
                      <FaTrash />
                    </IconButton>
                    <IconButton onClick={() => updateQuantity(index, -1)}>
                      <FaMinus style={{ color: "red" }} />
                    </IconButton>
                    <TextField
                      type="number"
                      value={item.jumlah}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                    />
                    <IconButton onClick={() => updateQuantity(index, 1)}>
                      <FaPlus style={{ color: "green" }} />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Cart Kosong...</p>
          )}
        </Col>
        <Col md={4}>
          <div className="border p-3 rounded">
            <h5>Total</h5>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>{"Rp" + subtotal.toLocaleString("id-ID") + ",00"}</span>
            </div>
            <Button
              disabled={cart.length <= 0}
              variant="success"
              className="w-100 mt-3"
              onClick={handleOrderClick}
            >
              Buat Pesanan
            </Button>
          </div>
        </Col>
      </Row>

      {/* Order Modal */}
      <Modal size="md" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Buat Pesanan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Stack
              direction="horizontal"
              gap={3}
              className="mb-2 justify-content-center"
            >
              <FormControlLabel
                value={isDelivery}
                control={
                  <Switch
                    color="primary"
                    onChange={handleChangeIsi}
                    checked={isDelivery}
                  />
                }
                label={isDelivery ? "Pesan Antar" : "Ambil Sendiri"}
                labelPlacement="start"
              />
            </Stack>
            <div className="mb-3">
              {isDelivery && (
                <select
                  className="form-select"
                  value={transaksi.id_alamat}
                  onChange={(e) =>
                    setTransaksi({ ...transaksi, id_alamat: e.target.value })
                  }
                >
                  <option value="">Pilih Alamat</option>
                  {alamat.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.nama_penerima}, {address.no_telepon},
                      {address.kota}, {address.jalan}, {address.rincian}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Menampilkan Rincian Pesanan */}
            <div>
              <h5>Rincian Pesanan:</h5>
              <Row>
                <Col>
                  <strong>Nama Produk</strong>
                </Col>
                <Col>
                  <strong>Harga</strong>
                </Col>
                <Col>
                  <strong>Jumlah</strong>
                </Col>
                <Col>
                  <strong>Total</strong>
                </Col>
              </Row>
              {cart.map((item, index) => (
                <div key={index} className="mb-2">
                  <Row>
                    <Col>{item.produk?.nama || item.hampers?.nama}</Col>

                    <Col>
                      {"Rp" +
                        (
                          item.produk?.harga || item.hampers?.harga
                        ).toLocaleString("id-ID")}
                    </Col>
                    <Col>{item.jumlah}</Col>
                    <Col>
                      {"Rp" +
                        (
                          item.jumlah *
                          (item.produk?.harga ||
                            item.jumlah * item.hampers?.harga)
                        ).toLocaleString("id-ID")}
                    </Col>
                  </Row>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <p>
                  <strong>Subtotal:</strong>
                </p>
                <p>
                  {"Rp" +
                    cart
                      .reduce((total, item) => {
                        const itemPrice = item.produk
                          ? item.produk.harga
                          : item.hampers
                          ? item.hampers.harga
                          : 0;
                        return total + itemPrice * item.jumlah;
                      }, 0)
                      .toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setShowModal(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            disabled={
              (isDelivery && transaksi.id_alamat.trim() === "") || isPending
            }
            variant="success"
            onClick={() => submitData()}
          >
            Pesan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Penghapusan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus item ini dari keranjang?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
