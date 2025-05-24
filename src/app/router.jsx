import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/login';
import Register from '../features/register';
import NotFound from '../features/not-found';
import Upload from '../features/upload';
import Analysis from '../features/analysis';
import Settings from '../features/settings';
import Home from '../features/home';
import { useAuth } from '../context/AuthContext.jsx';
import UserRegister from '../features/admin/UserRegister';
import UsersList from '../features/admin/UsersList.jsx';
import Dashboard from '../features/admin/Dashboard.jsx';
import Kpis from '../features/admin/kpis/index.jsx';
import EditUser from '../features/admin/EditUser.jsx';
import Report from '../features/report';
import ReportDetails from '../features/reportDetails';
import ForgotPassword from '../features/ForgotPassword/index.jsx';
import ResetPassword from '../features/ResetPassword/index.jsx';
import VerifyEmailPage from '../features/verify-email/index.jsx';
import { ROUTES } from '../constants/routes';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to={ROUTES.LOGIN} />;
};

const AdminRoute = ({ element }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? (
    element
  ) : (
    <Navigate to={ROUTES.LOGIN} />
  );
};

const PublicRoute = ({ element }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} />;
  }

  return element;
};

const AppRoutes = () => (
  <Routes>
    {/* Public Pages */}
    <Route path={ROUTES.HOME} element={<Home />} />

    {/* Auth */}
    <Route path={ROUTES.LOGIN} element={<PublicRoute element={<Login />} />} />
    <Route
      path={ROUTES.REGISTER}
      element={<PublicRoute element={<Register />} />}
    />
    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
    <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />

    {/* Authenticated User Panel */}
    <Route
      path={ROUTES.UPLOAD}
      element={<PrivateRoute element={<Upload />} />}
    />
    <Route
      path={ROUTES.ANALYSIS}
      element={<PrivateRoute element={<Analysis />} />}
    />
    <Route
      path={ROUTES.SETTINGS}
      element={<PrivateRoute element={<Settings />} />}
    />

    {/* Admin Panel */}
    <Route
      path={ROUTES.ADMIN_DASHBOARD}
      element={<AdminRoute element={<Dashboard />} />}
    />
    <Route
      path={ROUTES.ADMIN_USERS}
      element={<AdminRoute element={<UsersList />} />}
    />
    <Route
      path={ROUTES.ADMIN_USER_CREATE}
      element={<AdminRoute element={<UserRegister />} />}
    />
    <Route
      path={ROUTES.ADMIN_USER_EDIT()}
      element={<AdminRoute element={<EditUser />} />}
    />
    <Route
      path={ROUTES.ADMIN_KPIS}
      element={<AdminRoute element={<Kpis />} />}
    />

    {/* Reports */}
    <Route path={ROUTES.REPORTS} element={<Report />} />
    <Route path={ROUTES.REPORT_DETAILS()} element={<ReportDetails />} />

    {/* 404 Fallback */}
    <Route path='*' element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
