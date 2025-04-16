import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/login';
import Register from '../features/register';
import NotFound from '../features/not-found';
import Upload from '../features/upload';
import Analysis from '../features/analysis';
import Home from '../features/home';
import Dashboard from '../features/admin/Dashboard';
import { useAuth } from '../context/AuthContext.jsx';
import UserRegister from '../features/admin/UserRegister';
import UsersList from '../features/admin/UsersList.jsx';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to='/login' />;
};

const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to='/' /> : element;
};

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/login' element={<PublicRoute element={<Login />} />} />
    <Route path='/register' element={<PublicRoute element={<Register />} />} />
    <Route path='/upload' element={<PrivateRoute element={<Upload />} />} />
    <Route path='/analysis' element={<PrivateRoute element={<Analysis />} />} />
    <Route path='/admin-dashboard' element={<UserRegister/>} />
    <Route path="/registrar" element={<UserRegister />} />
    <Route path="/usuarios" element={<UsersList />} />
    <Route path='*' element={<NotFound />} />
  </Routes>
);

export default AppRoutes;