import { useEffect, useState } from 'react';
import api from '../api';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Greška pri učitavanju porudžbina:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center">Učitavanje porudžbina...</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🧾 Moje porudžbine</h2>

      {orders.length === 0 ? (
        <div className="text-center text-muted">Nema porudžbina.</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-4">
            <div className="card-header">
              Broj porudžbine: #{order.id} — Ukupno: {order.total} RSD
              <br />
              Datum: {new Date(order.created_at).toLocaleString()}
            </div>
            <ul className="list-group list-group-flush">
              {order.items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between">
                  <div>
                    {item.product?.name || 'Proizvod obrisan'} — {item.price} RSD × {item.quantity}
                  </div>
                  <div className="fw-bold">
                    = {item.price * item.quantity} RSD
                  </div>
                </li>
              ))}
              {order.status === 'completed' && (
            <div className="card-footer text-end">
              <a
                href={`http://localhost:8000/storage/pdf/porudzbina-${order.id}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                📄 Preuzmi PDF potvrdu
              </a>
            </div>
          )}
            </ul>
          </div>
          
          
        ))
      )}
      
    </div>
  );
}

export default MyOrders;
