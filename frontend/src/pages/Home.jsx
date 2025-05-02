import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';


function Home() {
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();


  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/products/featured');
        setFeatured(response.data);
      } catch (error) {
        console.error('Greška pri učitavanju istaknutih proizvoda:', error);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Dobrodošli u Good-Food!</h1>
      <p className="text-lg mb-6">
        Najbolja platforma za zdravu hranu — poveži se sa proizvođačima i uživaj!
      </p>
      <Link to="/products" className="btn btn-success btn-lg mb-5">Pogledaj sve proizvode</Link>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Istaknuti proizvodi</h2>
      <div className="row justify-content-center">
        {featured.map(product => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              {product.image && (
                <img src={`http://localhost:8000/storage/${product.image}`} className="card-img-top" alt={product.name} />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <span className="fw-bold">{product.price} RSD</span>
                <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline-success">Detalji</Link>
                <button
                  className="btn btn-sm btn-outline-secondary mt-2"
                  onClick={() => addToCart(product)}
                >
                  Dodaj u 🛒 
                </button>
              </div>
            </div>
          </div>
        ))}
        {featured.length === 0 && <p className="text-muted">Nema istaknutih proizvoda.</p>}
      </div>
    </div>
  );
}

export default Home;
