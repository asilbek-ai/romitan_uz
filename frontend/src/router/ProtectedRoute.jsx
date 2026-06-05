import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function ProtectedRoute({ requiredRoles = [] }) {
  const { isAuthenticated, admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(admin?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}