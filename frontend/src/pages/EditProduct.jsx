import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';


function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    price: '',
    old_price: '',
    description: '',
    stock: 0,
    category_id: '',
    barcode: '',
    image: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct({
          name: res.data.name || '',
          brand: res.data.brand || '',
          price: res.data.price || '',
          old_price: res.data.old_price || '',
          description: res.data.description || '',
          stock: res.data.stock || 0,
          category_id: res.data.category_id || '',
          barcode: res.data.barcode || '',
          image: null,
        });
      } catch (err) {
        setError('Greška pri učitavanju proizvoda.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Greška pri učitavanju kategorija:', err);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setProduct({ ...product, image: files[0] });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.entries(product).forEach(([key, val]) => {
        if (val !== null) formData.append(key, val);
      });

      await api.post(`/products/${id}?_method=PUT`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Proizvod uspešno ažuriran!');
      navigate('/products');
    } catch (err) {
      console.error(err);
      setError('Greška pri ažuriranju proizvoda.');
    }
  };

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Uredi proizvod</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Naziv</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Brend / Proizvođač</label>
          <input type="text" name="brand" value={product.brand || ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Cena</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Stara cena (opciono)</label>
          <input type="number" name="old_price" value={product.old_price || ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Opis</label>
          <textarea name="description" value={product.description} onChange={handleChange} className="form-control" rows="3" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Kategorija</label>
          <select name="category_id" value={product.category_id || ''} onChange={handleChange} className="form-select" required>
            <option value="">-- Odaberi kategoriju --</option>
            {categories.map((cat) => (
                <React.Fragment key={cat.id}>
                  <option value={cat.id}>{cat.name}</option>
                  {cat.children?.map((child) => (
                    <option key={child.id} value={child.id}>
                      &nbsp;&nbsp;&nbsp;↳ {child.name}
                    </option>
                  ))}
                </React.Fragment>
              ))}

          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Količina na stanju</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Bar kod (opciono)</label>
          <input type="text" name="barcode" value={product.barcode} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-4">
          <label className="form-label">Slika (izaberi fajl)</label>
          <input type="file" name="image" onChange={handleChange} className="form-control" accept="image/*" />
        </div>
        <button type="submit" className="btn btn-primary w-100">Sačuvaj izmene</button>
      </form>
    </div>
  );
}

export default EditProduct;