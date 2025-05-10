import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/my-products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Greška pri učitavanju mojih proizvoda:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  if (loading) return <div className="text-center mt-5">Učitavanje...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🛒 Moji proizvodi</h2>
      {products.length === 0 ? (
        <p className="text-muted">Još uvek niste dodali nijedan proizvod.</p>
      ) : (
        <div className="row">
          {products.map(product => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100">
                {product.image && (
                  <img
                    src={`http://localhost:8000/storage/${product.image}`}
                    className="card-img-top"
                    alt={product.name}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p><strong>Cena:</strong> {product.price} RSD</p>
                  <p><strong>Količina:</strong> {product.stock}</p>
                  <Link to={`/products/edit/${product.id}`} className="btn btn-sm btn-outline-primary me-2">Uredi</Link>
                  <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline-success">Detalji</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;
