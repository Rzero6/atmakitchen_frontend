const Footer = () => {
    return (
      <>
        <footer className="bg-dark mt-5 bg-footer text-light">
          <div className="container p-3">
            <div className="row">
              <div className="col-md-3">
                <h3>Tentang Kami</h3>
                <p>
                  Temukan opsi terbaik untuk merental mobil dengan website kami.
                  Kami memiliki banyak opsi kendaraan dari mobil kecil sampai
                  dengan truk dan bis yang banyak.
                </p>
              </div>
  
              <div className="col-md-3">
                <h3>Link Cepat</h3>
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
              </div>
  
              <div className="col-md-3">
                <h3>Kontak Informasi</h3>
                <address>
                  <p>
                    <i className="fa-solid fa-map-marker-alt"></i> Yogyakarta,
                    Jalan Babarsari 123
                  </p>
                  <p>
                    <i className="fa-solid fa-phone"></i> +1 (123) 456-7890
                  </p>
                  <p>
                    <i className="fa-solid fa-envelope"></i> info@rentalmobil.com
                  </p>
                </address>
              </div>
  
              <div className="col-md-3">
                <h3>Ikuti Kami di</h3>
                <div className="footer-social">
                  <a className="text-decoration-none" href="#">
                    <i className="fa-brands fa-facebook text-light"></i>
                  </a>
                  <a className="text-decoration-none" href="#">
                    <i className="fa-brands fa-twitter text-light"></i>
                  </a>
                  <a className="text-decoration-none" href="#">
                    <i className="fa-brands fa-instagram text-light"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
  
        <div className="bg-dark text-light text-center py-2">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Rental Mobil</p>
            <ul className="list-inline">
              <li className="list-inline-item">
                <a href="https://policies.google.com/privacy?hl=en">
                  Kebijakan Privasi
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://policies.google.com/terms?hl=en">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  };
  
  export default Footer;
  