import { Col, Container, Row, Stack } from "react-bootstrap";
import dayjs from "dayjs";

const ListPesananHarian = ({ transaksi }) => {
  const today = dayjs();
  const rekap = [];
  transaksi.forEach((atransaksi) => {
    atransaksi.detail.forEach((adetail) => {
      if (adetail.hampers) {
        adetail.hampers.detailhampers.forEach((adetailhampers) => {
          if (adetailhampers.produk) {
            const existingDetailIndex = rekap.findIndex(
              (item) => item.produk.id === adetailhampers.produk.id
            );
            if (existingDetailIndex === -1) {
              const detail = {
                jumlah: adetailhampers.jumlah,
                produk: adetailhampers.produk,
              };
              rekap.push(detail);
            } else {
              rekap[existingDetailIndex].jumlah += adetailhampers.jumlah;
            }
          }
        });
      }
      if (adetail.produk) {
        const existingDetailIndex = rekap.findIndex(
          (item) => item.produk.id === adetail.produk.id
        );
        if (existingDetailIndex === -1) {
          const detail = {
            jumlah: adetail.jumlah,
            produk: adetail.produk,
          };
          rekap.push(detail);
        } else {
          rekap[existingDetailIndex].jumlah += adetail.jumlah;
        }
      }
    });
  });
  const resep = [];
  rekap.forEach((arekap) => {
    const data = {
      nama: arekap.produk.nama,
      jumlah: arekap.jumlah,
      resep: arekap.produk.resep,
    };
    resep.push(data);
  });
  const rekapBahan = [];
  const bahanBakuSet = new Set();

  resep.forEach((aresep) => {
    if (typeof aresep === "object" && Array.isArray(aresep.resep)) {
      aresep.resep.forEach((bahan) => {
        if (!bahanBakuSet.has(bahan.bahan_baku.nama)) {
          bahanBakuSet.add(bahan.bahan_baku.nama);
          const existingDetailIndex = rekapBahan.findIndex(
            (item) => item.bahan_baku.id === bahan.bahan_baku.id
          );
          if (existingDetailIndex === -1) {
            rekapBahan.push({
              bahan_baku: bahan.bahan_baku,
              takaran: bahan.takaran * aresep.jumlah,
            });
          } else {
            rekapBahan[existingDetailIndex].takaran +=
              aresep.jumlah * bahan.takaran;
          }
        }
      });
    }
  });
  rekapBahan.sort((a, b) => a.bahan_baku.nama.localeCompare(b.bahan_baku.nama));

  return (
    <Container>
      <Row className="border border-1 border-black text-center">
        <p className="customP">
          <strong>List Pesanan Harian</strong>
        </p>
        <p className="customP">
          Tanggal : {today.add(1, "day").format("DD/MM/YYYY")}
        </p>
      </Row>
      {transaksi.length > 0 ? (
        <>
          <Row>
            <Col className="border border-1  border-black">
              <p className="customP">
                <strong>List Pesanan</strong>
              </p>
              {transaksi.map((atransaksi, index) => (
                <Stack key={index}>
                  <p className="customP">
                    No Nota: {today.format("YY.MM.") + atransaksi.id}
                  </p>
                  <p className="customP">
                    Nama: {atransaksi.customer.user.nama}
                  </p>
                  <p className="customP">
                    Jam {dayjs(atransaksi.tanggal_penerimaan).format("HH:mm")}
                  </p>
                  {atransaksi.detail.map((adetail, index2) => (
                    <p
                      className={
                        index2 !== atransaksi.detail.length - 1 ? "customP" : ""
                      }
                      key={index2}
                    >
                      {adetail.produk
                        ? adetail.jumlah +
                          " " +
                          adetail.produk.nama +
                          " " +
                          adetail.produk.ukuran
                        : adetail.jumlah + " Hampers " + adetail.hampers.nama}
                    </p>
                  ))}
                </Stack>
              ))}
            </Col>
            <Col className="border border-1  border-black">
              <p>
                <strong>Rekap</strong>
              </p>
              {rekap.map((produk, index) => (
                <Stack key={index}>
                  <p className="customP">
                    {produk.jumlah +
                      " " +
                      produk.produk.nama +
                      " " +
                      produk.produk.ukuran}
                  </p>
                </Stack>
              ))}

              <hr className="border-top border-dark border-1 opacity-100 w-100" />
              {rekap.map((produk, index) => (
                <Stack key={index}>
                  <p className="customP">
                    {produk.jumlah +
                      " " +
                      produk.produk.nama +
                      " " +
                      produk.produk.ukuran}
                  </p>
                </Stack>
              ))}
            </Col>
          </Row>
          <Row>
            <Col className="border border-1  border-black">
              <p className="customP">
                <strong>Bahan</strong>
              </p>
              {resep.map((aresep, index) => (
                <Stack key={index}>
                  <p className="customP mt-2">
                    <strong>{aresep.nama}</strong>
                  </p>
                  {aresep.resep.map((bahan, index) => (
                    <p key={index} className="customP">
                      {bahan.takaran +
                        " " +
                        bahan.bahan_baku.satuan +
                        " " +
                        bahan.bahan_baku.nama}
                    </p>
                  ))}
                </Stack>
              ))}
            </Col>
            <Col className="border border-1  border-black">
              <p>
                <strong>Rekap Bahan</strong>
              </p>
              {rekapBahan.map((bahan, index) => (
                <Stack key={index}>
                  <p key={index} className="customP">
                    {bahan.bahan_baku.nama +
                      " " +
                      bahan.takaran +
                      " " +
                      bahan.bahan_baku.satuan}

                    {bahan.bahan_baku.stok <= bahan.takaran && (
                      <strong className="text-danger">
                        {"  (WARNING: STOK " +
                          bahan.bahan_baku.stok +
                          " " +
                          bahan.bahan_baku.satuan +
                          ")"}
                      </strong>
                    )}
                  </p>
                </Stack>
              ))}
            </Col>
          </Row>
        </>
      ) : (
        <Row className="text-center border border-black">
          <Col>Tidak Ada Pesanan</Col>
        </Row>
      )}
    </Container>
  );
};

export default ListPesananHarian;
