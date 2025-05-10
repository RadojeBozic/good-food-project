import { Link } from 'react-router-dom';

function ProcurerDashboard() {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">🔧 Dobavljač kontrolna tabla</h2>

      <div className="list-group">
        <Link to="/my-products" className="list-group-item list-group-item-action">
          📦 Moji proizvodi
        </Link>
        <Link to="/add-product" className="list-group-item list-group-item-action">
          ➕ Dodaj novi proizvod
        </Link>
        
        <Link to="/import-products" className="list-group-item list-group-item-action">
          📥 Import iz Excel/CSV fajla
        </Link>
      </div>
    </div>
  );
}

export default ProcurerDashboard;
