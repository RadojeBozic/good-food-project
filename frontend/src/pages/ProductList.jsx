import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';


function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Greška pri učitavanju proizvoda:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleToggleFeatured = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/products/${id}/toggle-featured`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Greška pri togglovanju featured statusa:', error);
      alert('Greška pri ažuriranju statusa proizvoda.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj proizvod?')) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Proizvod uspešno obrisan!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Greška prilikom brisanja proizvoda.');
    }
  };

  const renderAdminActions = (product) => (
    <>
      <Link to={`/products/edit/${product.id}`} className="btn btn-sm btn-outline-primary mt-2 me-2">
        Uredi
      </Link>
      <button
        onClick={() => handleDelete(product.id)}
        className="btn btn-sm btn-outline-danger mt-2"
      >
        Obriši
      </button>
      {user.role === 'admin' || user.role === 'superadmin' ? (
        <button
          className={`btn btn-sm ${product.featured ? 'btn-warning' : 'btn-outline-warning'} mt-2`}
          onClick={() => handleToggleFeatured(product.id)}
        >
          {product.featured ? '❌ Opozovi isticanje' : '⭐ Istakni'}
        </button>
      ) : null}
    </>
  );

  if (loading) {
    return <div className="text-center">Učitavanje proizvoda...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">Ponuda proizvoda</h1>
      <div className="row">
        {products.length > 0 ? (
          products.map(product => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100">
                {product.image && (
                  <img
                    src={`http://localhost:8000/storage/${product.image}`}
                    alt={product.name}
                    className="img-fluid rounded"
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="text-muted">Na stanju: {product.stock} kom</p>

                </div>
                <div className="card-footer d-flex justify-content-between">
                  <span className="fw-bold">{product.price} RSD</span>
                  <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline-success">
                    Detalji
                  </Link>
                </div>
                {user && (user.role === 'admin' || user.role === 'superadmin' || user.id === product.user_id) && (
                  renderAdminActions(product)
                )}
                <button
                  className="btn btn-sm btn-outline-secondary mt-2"
                  onClick={() => addToCart(product)}
                >
                  🛒 Dodaj u korpu
                </button>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center">Nema dostupnih proizvoda.</div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
