import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../contexts/CartContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="w-100 bg-success text-white p-3">
  <div className="container">
    <div className="row align-items-center">

      {/* Levo: Logo */}
      <div className="col-md-4 d-flex align-items-center">
        <span className="h4 mb-0">
          🥦 Good-Food
        </span>
      </div>

      {/* Centar: Navigacija */}
      <div className="col-md-4 d-flex justify-content-center">
        <nav className="nav">
          <Link to="/" className="nav-link text-white">Home</Link>
          <Link to="/about" className="nav-link text-white">About</Link>
          <Link to="/contact" className="nav-link text-white">Contact</Link>
          <Link to="/products" className="nav-link text-white">Proizvodi</Link>

        </nav>
      </div>

      {/* Desno: Welcome + Logout */}
      <div className="col-md-4 d-flex justify-content-end align-items-center">
        {!user && (
          <>
            <Link to="/login" className="btn btn-outline-light btn-sm me-2">Login</Link>
            <Link to="/register" className="btn btn-light btn-sm">Register</Link>
          </>
        )}

        {user && (user.role === 'admin' || user.role === 'superadmin') && (
          <Link to="/add-product" className="btn btn-outline-light btn-sm me-2">
            Dodaj proizvod
          </Link>
        )}


        {user && (
          <>
            <span className="me-3">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
            >
              Logout
            </button>
          </>
        )}

          <Link to="/cart" className="btn btn-outline-light position-relative">
            🛒 Korpa
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>
            )}
          </Link>
          <Link to="/my-orders" className="nav-link">
            🧾 Moje porudžbine
          </Link>
          {user && (user.role === 'admin' || user.role === 'superadmin') && (
          <Link to="/admin" className="btn btn-warning ms-3">
            🔧 Admin Panel
          </Link>
        )}
      </div>

    </div>
  </div>
</header>

  );
}

export default Header;
