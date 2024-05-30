import { useState } from "react";
import { Button, Modal, Spinner, Stack } from "react-bootstrap";

const KonfirmasiModal = ({
  title,
  buttonVariant,
  handleOK,
  isPending,
  data,
}) => {
  const [show, setShow] = useState(false);
  const handleOkClick = () => {
    setShow(false);
    handleOK(data);
  };
  return (
    <>
      <Button variant={buttonVariant} onClick={() => setShow(true)}>
        {title}
      </Button>
      {/* Modal */}
      {setShow && (
        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Konfirmasi <strong>{title}</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack
              direction="horizontal"
              gap={2}
              className="justify-content-end"
            >
              <Button
                variant="primary"
                disabled={isPending}
                onClick={handleOkClick}
              >
                {isPending ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </>
                ) : (
                  <span>OK</span>
                )}
              </Button>
              <Button
                variant="danger"
                onClick={() => setShow(false)}
                disabled={isPending}
              >
                Batal
              </Button>
            </Stack>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default KonfirmasiModal;
