import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: 0,
    category_id: '',
    barcode: '',
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
       useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Greška pri učitavanju kategorija:', err);
    }
  };

  fetchCategories();
}, []);
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
        <div className="mb-3">
            <label className="form-label">Kategorija</label>
            <select
              name="category_id"
              value={product.category_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Odaberi kategoriju --</option>
              {categories.map((cat) => (
                <>
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                  {cat.children.map((child) => (
                    <option key={child.id} value={child.id}>
                      &nbsp;&nbsp;&nbsp;↳ {child.name}
                    </option>
                  ))}
                </>
              ))}
            </select>
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
        <div className="mb-3">
          <label className="form-label">Bar kod (opciono)</label>
          <input
            type="text"
            name="barcode"
            value={product.barcode}
            onChange={handleChange}
            className="form-control"
            placeholder="Unesite ili skenirajte bar kod"
          />
        </div>


        <button type="submit" className="btn btn-primary w-100">Sačuvaj izmene</button>
      </form>
    </div>
  );
}

export default EditProduct;
