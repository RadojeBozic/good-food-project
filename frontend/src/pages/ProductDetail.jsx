import { useParams, Link } from 'react-router-dom';
import mockProducts from '../data/mockProducts';

function ProductDetail() {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return <div className="text-center text-danger">Proizvod nije pronađen.</div>;
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
          src={`http://localhost:8000/storage/${product.image}`}
          alt={product.name}
          className="img-fluid rounded"
        />      
      <p className="mb-3">{product.description}</p>
      <h4 className="mb-4 fw-bold">{product.price} RSD</h4>
      <Link to="/products" className="btn btn-secondary">Nazad na proizvode</Link>
    </div>
  );
}

export default ProductDetail;
