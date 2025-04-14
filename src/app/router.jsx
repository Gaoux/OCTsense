import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/login';
import Register from '../features/register';
import NotFound from '../features/not-found';
import Upload from '../features/upload';
import Home from '../features/home';
import { useAuth } from '../context/AuthContext.jsx';

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
    <Route path='*' element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
