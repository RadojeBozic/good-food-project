function Footer() {
  return (
    <footer className="bg-success text-white text-center text-dark pt-4">
      <div className="container p-4">
        <div className="row">
          <div className="col-md-3 mb-4">
            <h5>Informacije</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">O nama</a></li>
              <li><a href="#" className="text-white">Kontakt</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5>Pravilnici</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">Uslovi korišćenja</a></li>
              <li><a href="#" className="text-white">Politika privatnosti</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5>Linkovi</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">Proizvodi</a></li>
              <li><a href="#" className="text-white">Partneri</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5>Uputstva</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">Kako kupovati</a></li>
              <li><a href="#" className="text-white">Kako prodavati</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center p-3 bg-success text-white">
        © 2025 Good-Food. Sva prava zadržana.
      </div>
    </footer>
  );
}

export default Footer;
