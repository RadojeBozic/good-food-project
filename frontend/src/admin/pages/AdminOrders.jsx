import { useEffect, useState } from 'react';
import api from '../../api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Ažuriraj lokalno stanje
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Greška pri promeni statusa:', err);
      alert('Nije moguće promeniti status.');
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/admin/orders', {
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

  if (loading) return <div className="text-center mt-5">Učitavanje...</div>;
  
  return (
    <div className="container mt-5">
      <h2 className="mb-4">📦 Sve porudžbine</h2>
      {orders.length === 0 ? (
        <div className="text-muted text-center">Nema porudžbina.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              🧾 Porudžbina #{order.id} | {order.user?.name} | {order.total} RSD
              <br />
              Datum: {new Date(order.created_at).toLocaleString()}
            </div>

            <select
              className="form-select w-auto"
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
              <option value="pending">🟡 Na čekanju</option>
              <option value="processed">🟠 U obradi</option>
              <option value="completed">🟢 Završeno</option>
            </select>
          </div>

            <ul className="list-group list-group-flush">
              {order.items.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between">
                  <div>
                    {item.product?.name || 'Proizvod obrisan'} — {item.price} RSD × {item.quantity}
                  </div>
                  <div className="fw-bold">{item.price * item.quantity} RSD</div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
