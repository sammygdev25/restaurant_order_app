import './App.css';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { Footer } from './components/ui';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ReservationsPage from './pages/ReservationsPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import StaffMenuManagementPage from './pages/StaffMenuManagementPage';
import StaffOrdersManagementPage from './pages/StaffOrdersManagementPage';
import StaffReservationsManagementPage from './pages/StaffReservationsManagementPage';
import DishListPage from './pages/DishListPage';
import ProfilePage from './pages/ProfilePage';

interface RequireAuthProps { children: ReactNode }

function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth() as { isAuthenticated?: boolean; loading?: boolean };
  if (auth && auth.loading) {
    return null;
  }
  const authed = auth && typeof auth.isAuthenticated === 'boolean' ? auth.isAuthenticated : Boolean(localStorage.getItem('token'));
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ErrorBoundary>
          <div className="ds-page">
            <Navbar />
            <main className="ds-page-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
                <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
                <Route path="/orders" element={<RequireAuth><OrderHistoryPage /></RequireAuth>} />
                <Route path="/orders/:id" element={<RequireAuth><OrderDetailPage /></RequireAuth>} />
                <Route path="/reservations" element={<RequireAuth><ReservationsPage /></RequireAuth>} />
                <Route path="/staff/dashboard" element={<RequireAuth><StaffDashboardPage /></RequireAuth>} />
                <Route path="/staff/menu" element={<RequireAuth><StaffMenuManagementPage /></RequireAuth>} />
                <Route path="/staff/orders" element={<RequireAuth><StaffOrdersManagementPage /></RequireAuth>} />
                <Route path="/staff/reservations" element={<RequireAuth><StaffReservationsManagementPage /></RequireAuth>} />
                <Route path="/dishes" element={<DishListPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dashboard" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer brand="Restaurant Order App" columns={[{ title: 'Explore', links: [{ label: 'Home', to: '/' }, { label: 'Dishes', to: '/dishes' }, { label: 'Profile', to: '/profile' }] }]} />
          </div>
        </ErrorBoundary>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
