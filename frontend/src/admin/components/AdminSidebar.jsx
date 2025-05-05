import { Link } from 'react-router-dom';

function AdminSidebar() {
  return (
    <div className="bg-dark text-white p-3" style={{ minWidth: '220px', height: '100vh' }}>
      <h4>🔧 Admin Panel</h4>
      <ul className="nav flex-column mt-3">
        <li className="nav-item"><Link className="nav-link text-white" to="/admin">📊 Dashboard</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/admin/orders">📦 Porudžbine</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/admin/users">👥 Korisnici</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/admin/products">🛍️ Proizvodi</Link></li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
