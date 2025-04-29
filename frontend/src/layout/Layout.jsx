import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: 'url("/images/good-food-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backdropFilter: 'brightness(0.95)', // Blaga svetlina
      }}
    >
      <Header />
      <main className="flex-grow p-4 flex justify-center">
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
