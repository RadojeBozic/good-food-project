import { useEffect, useState } from 'react';
import api from '../api';

function ProductSidebar({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get('/categories-with-count');
      setCategories(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="list-group">
      <h5 className="mb-3">🧭 Kategorije</h5>
      {categories.map((cat) => (
        <div key={cat.id}>
          <button
            className="list-group-item list-group-item-action"
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.name} ({cat.products_count})
          </button>

          {cat.children.map((sub) => (
            <button
              key={sub.id}
              className="list-group-item list-group-item-action ms-3"
              onClick={() => onSelectCategory(sub.id)}
            >
              ↳ {sub.name} ({sub.products_count})
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ProductSidebar;
