import { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Greška pri učitavanju proizvoda:', err);
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

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await api.post('/admin/categories', { name: newCategory }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewCategory('');
      fetchCategories();
      alert('Kategorija uspešno dodata.');
    } catch (err) {
      console.error('Greška pri dodavanju kategorije:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete proizvod?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error('Greška pri brisanju proizvoda:', err);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/products/${id}/toggle-featured`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error('Greška pri isticanju proizvoda:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🛠 Administracija proizvoda</h2>

      <div className="card p-3 mb-4">
        <h5>➕ Dodaj novu kategoriju</h5>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Naziv kategorije"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleAddCategory}>
            Dodaj
          </button>
        </div>
      </div>

      <h5>📋 Lista proizvoda ({products.length})</h5>
      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Naziv</th>
              <th>Brend</th>
              <th>Kategorija</th>
              <th>Stara/Nova cena</th>
              <th>Na stanju</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category?.name || 'N/A'}</td>
                <td>
                  {product.old_price
                    ? <><s>{product.old_price} RSD</s> ➝ {product.price} RSD</>
                    : `${product.price} RSD`}
                </td>
                <td>{product.stock}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-1" onClick={() => navigate(`/products/edit/${product.id}`)}>Uredi</button>
                  <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(product.id)}>Obriši</button>
                  <button className="btn btn-sm btn-warning" onClick={() => handleToggleFeatured(product.id)}>
                    {product.featured ? '❌' : '⭐'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProducts;