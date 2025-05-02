import { useCart } from '../contexts/CartContext';
import api from '../api';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return <div className="text-center mt-5">🛒 Vaša korpa je prazna.</div>;
  }

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await api.post('/checkout', { cart }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert(response.data.message);
      clearCart();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Greška prilikom obrade porudžbine.');
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🛒 Vaša korpa</h2>
      <ul className="list-group mb-4">
      {cart.map((item) => (
  <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap" key={item.id}>
    <div className="w-100 mb-2">
      <strong>{item.name}</strong> — {item.price} RSD
    </div>
    <div className="d-flex align-items-center gap-2">
      <label className="me-2 mb-0">Količina:</label>
      <input
        type="number"
        min="1"
        max={item.stock}
        value={item.quantity}
        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
        className="form-control form-control-sm"
        style={{ width: '70px' }}
      />
    </div>
    <button className="btn btn-sm btn-danger mt-2" onClick={() => removeFromCart(item.id)}>Ukloni</button>
  </li>
))}
      </ul>
      <h4 className="mb-3">Ukupno: {total.toFixed(2)} RSD</h4>
      <button className="btn btn-outline-danger me-3" onClick={clearCart}>🧹 Isprazni korpu</button>
      <button className="btn btn-success" onClick={handleCheckout}>
        ✅ Kupi
      </button>    
      </div>
  );
}

export default Cart;
