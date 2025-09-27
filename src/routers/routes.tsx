import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import PosturPage from '../pages/PosturPage';
import SourcePage from '../pages/SourcePage';
import AccountPage from '../pages/AccountPage';

const routes: RouteObject[] = [
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/postur-apbd',
    element: (
      <PrivateRoute>
        <PosturPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/source',
    element: (
      <PrivateRoute>
        <SourcePage />
      </PrivateRoute>
    ),
  },
  {
    path: '/account',
    element: (
      <PrivateRoute>
        <AccountPage />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;
