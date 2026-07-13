import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AccessDenied from '../pages/AccessDenied';
import LoadingSpinner from '../components/LoadingSpinner';

const RoleRoute = ({ roles, children }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!roles.includes(role)) {
    return <AccessDenied />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;
