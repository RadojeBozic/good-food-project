import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layout/Layout';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import { CartProvider } from './contexts/CartContext';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import AdminLayout from './admin/layout/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminOrders from './admin/pages/AdminOrders';
import AdminUsers from './admin/pages/AdminUsers';
import AdminProducts from './admin/pages/AdminProducts';
import MyProducts from './pages/MyProducts';
import ProcurerDashboard from './pages/ProcurerDashboard';
import ImportProducts from './pages/ImportProducts';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/procurer" element={<ProcurerDashboard />} />
            <Route path="/import-products" element={<ImportProducts />} />


            <Route path="register" element={<Register />} />
            {/* Ova ruta će biti za login */}
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            {/* Ovde ćemo kasnije dodati About, Contact, Products */}
            <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>
          </Route>
          
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
