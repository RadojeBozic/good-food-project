import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

function AdminLayout() {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <main className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
