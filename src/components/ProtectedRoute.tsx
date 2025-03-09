import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';

const AdminRoute = () => {
  const { user, isAuthenticated, setAuthModalOpen } = useStore();

  if (!isAuthenticated || !user || user.role !== 'admin') {
    setAuthModalOpen(true); // Open the authentication modal
    return <Navigate to="/" replace />; // Redirect to home
  }

  return <Outlet />; // Allow access if admin
};

export default AdminRoute;
