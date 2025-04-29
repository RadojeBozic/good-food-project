import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Učitavanje...</div>;
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {user.role === 'superadmin' && (
        <div>
          <h2 className="text-2xl mb-4">SuperAdmin kontrolna tabla</h2>
          <ul className="list-unstyled">
            <li>Korisnici - upravljanje</li>
            <li>Proizvodi - pregled i kontrola</li>
            <li>Statistika platforme</li>
          </ul>
        </div>
      )}

      {user.role === 'admin' && (
        <div>
          <h2 className="text-2xl mb-4">Admin kontrolna tabla</h2>
          <ul className="list-unstyled">
            <li>Agenti - upravljanje</li>
            <li>Proizvodi - pregled i kontrola</li>
          </ul>
        </div>
      )}

      {user.role === 'agent' && (
        <div>
          <h2 className="text-2xl mb-4">Agent kontrolna tabla</h2>
          <ul className="list-unstyled">
            <li>Moji proizvodi</li>
            <li>Dodavanje novih proizvoda</li>
          </ul>
        </div>
      )}

      {user.role === 'customer' && (
        <div>
          <h2 className="text-2xl mb-4">Kupac kontrolna tabla</h2>
          <ul className="list-unstyled">
            <li>Ponuda proizvoda</li>
            <li>Moje porudžbine (uskoro)</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
