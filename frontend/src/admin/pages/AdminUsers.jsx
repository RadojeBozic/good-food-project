import { useEffect, useState } from 'react';
import api from '../../api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Greška pri učitavanju korisnika:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/admin/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error('Greška pri promeni uloge:', err);
      alert('Nije moguće promeniti ulogu.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) return;
  
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Greška pri brisanju korisnika:', err);
      alert('Brisanje nije uspelo.');
    }
  };
  

  if (loading) return <div className="text-center mt-5">Učitavanje korisnika...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">👥 Svi korisnici</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Ime</th>
            <th>Email</th>
            <th>Rola</th>
            <th>Datum registracije</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                <select
                  className="form-select"
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={user.role === 'superadmin'}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">SuperAdmin</option>
                </select>
                {user.role !== 'superadmin' && (
                    <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDeleteUser(user.id)}>
                      ❌ Obriši
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
