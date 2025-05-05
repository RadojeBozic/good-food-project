import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedAdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedAdminRoute;
