import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
  
      await api.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      logout(); // Brišemo iz localStorage i AuthContext-a
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-3xl font-bold mb-6">Dobrodošli na Dashboard!</h1>

      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Korisnički profil</h2>
        <p><strong>Ime:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Rola:</strong> {user?.role}</p>
      </div>

      <button
        onClick={handleLogout}
        className="btn btn-danger btn-sm"
      >
        Odjava
      </button>
    </div>
  );
}

export default Dashboard;
