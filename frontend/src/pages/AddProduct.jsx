import { useEffect, useState } from 'react';
import api from '../api';

function AddProduct() {
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

  const [submittedProduct, setSubmittedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
  
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('description', product.description);
      formData.append('image', product.image);
      formData.append('stock', product.stock); // dodajemo količinu na stanju
  
      const response = await api.post('/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setSubmittedProduct(response.data);
      setProduct({
        name: '',
        price: '',
        description: '',
        image: '',
        stock: 0,
        category_id: '',
      });
  
    } catch (err) {
      console.error('Greška pri dodavanju proizvoda:', err);
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const messages = Object.values(errors).flat().join(' ');
        setError(messages);
      } else {
        setError('Došlo je do greške. Proverite podatke i pokušajte ponovo.');
      }
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Dodavanje proizvoda</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {!submittedProduct ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Naziv</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cena (RSD)</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Opis</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={product.description}
              onChange={handleChange}
              required
            />
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
            <label className="form-label">Slika (fajl)</label>
            <input
              type="file"
              name="image"
              className="form-control"
              onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
            />
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



          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? 'Dodavanje...' : 'Dodaj proizvod'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <h3 className="text-xl mb-4 text-success">Proizvod uspešno dodat!</h3>
          {submittedProduct.image && (
            <img
              src={submittedProduct.image}
              alt={submittedProduct.name}
              className="img-fluid rounded mb-3"
              style={{ maxHeight: '200px' }}
            />
          )}
          <h4>{submittedProduct.name}</h4>
          <p>{submittedProduct.description}</p>
          <p className="fw-bold">{submittedProduct.price} RSD</p>
        </div>
      )}
    </div>
  );
}

export default AddProduct;
