import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import { useCart } from '../contexts/CartContext'; 

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError('Proizvod nije pronađen.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center">Učitavanje...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      {product.image && (
        <img
          src={`http://localhost:8000/storage/${product.image}`}
          alt={product.name}
          className="img-fluid rounded"
        />
      )}
      <p className="mb-3">{product.description}</p>
      <h4 className="mb-4 fw-bold">{product.price} RSD</h4>
      <button
        className="btn btn-primary me-2"
        onClick={() => addToCart(product)}
      >
        🛒 Dodaj u korpu
      </button>
      <Link to="/products" className="btn btn-secondary">Nazad na proizvode</Link>
    </div>
  );
}

export default ProductDetail;
