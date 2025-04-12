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

const AppRoutes = () => (
  <Routes>
    <Route path='/Home' element={<Home />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/upload' element={<PrivateRoute element={<Upload />} />} />
    <Route path='*' element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
