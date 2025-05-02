import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Greška pri učitavanju proizvoda.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('Token u localStorage:', localStorage.getItem('token'));
      console.log('Token:', token);

      if (!token) {
        console.error('Token nije pronađen u localStorage');
        setError('Greška: Token nije pronađen.');
        return;
      }
      await api.put(`/products/${id}`, product, {
        headers: {
          Authorization: `Bearer ${token}`,

        },

      });

      alert('Proizvod uspešno ažuriran!');
      navigate('/products');
    } catch (err) {
      console.error(err);
      setError('Greška pri ažuriranju.');
    }
  };

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Uredi proizvod</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Naziv</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Cena</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Opis</label>
          <textarea name="description" value={product.description} onChange={handleChange} className="form-control" rows="3" required />
        </div>
        <div className="mb-4">
          <label className="form-label">Slika (URL)</label>
          <input type="text" name="image" value={product.image} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Količina na stanju</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="form-control"
            required
            min="0"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Sačuvaj izmene</button>
      </form>
    </div>
  );
}

export default EditProduct;
