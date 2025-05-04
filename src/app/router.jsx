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
import UploadModel from './../features/admin/UploadModel/index.jsx';

import Kpis from '../features/admin/kpis/index.jsx';
import EditUser from '../features/admin/EditUser.jsx';

import Report from '../features/report';
import ReportDetails from '../features/reportDetails';


const PrivateRoute = ({ element }) => {
  const { isAuthenticated, user } = useAuth(); 
  return isAuthenticated && user?.role !== 'admin' ? element : <Navigate to='/login' />;
};

const AdminRoute = ({ element }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? element : <Navigate to='/login' />;
};

const PublicRoute = ({ element }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to='/admin-dashboard' />;
  }

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  return element;
};

const AppRoutes = () => (
  <Routes>
    {/* Rutas públicas */}
    <Route path='/' element={<Home />} />
    <Route path='/login' element={<PublicRoute element={<Login />} />} />
    <Route path='/register' element={<PublicRoute element={<Register />} />} />

    {/* Rutas privadas (no accesibles para administradores) */}
    <Route path='/upload' element={<PrivateRoute element={<Upload />} />} />
    <Route path='/analysis' element={<PrivateRoute element={<Analysis />} />} />
    <Route path='/settings' element={<PrivateRoute element={<Settings />} />} />


    {/* Rutas exclusivas para administradores */}
    <Route path='/admin-dashboard' element={<AdminRoute element={<Dashboard />} />} />
    <Route path='/registrar' element={<AdminRoute element={<UserRegister />} />} />
    <Route path='/usuarios' element={<AdminRoute element={<UsersList />} />} />
    <Route path='/admin/kpis' element={<AdminRoute element={<Kpis />} />} />
    <Route path='/editar-usuario/:id' element={<AdminRoute element={<EditUser />} />} />
    <Route path='/report' element={<Report />} />
    <Route path='/report/:id' element={<ReportDetails />} />
    <Route path="/admin/upload-model" element={<UploadModel />} />

      
    {/* Ruta para páginas no encontradas */}
    <Route path='*' element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
