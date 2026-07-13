import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Prevent redirect loops if they hit a protected route that resolves to login
    if (location.pathname === '/login') return <Navigate to="/" replace />;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
