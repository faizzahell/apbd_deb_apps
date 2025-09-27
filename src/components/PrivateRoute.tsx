import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen">
        <main className="flex-grow overflow-hidden" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
