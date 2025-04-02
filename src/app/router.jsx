import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/Login/login_temp.jsx';
import Register from '../features/Register/register_temp.jsx';
import NotFound from '../features/not-found/NotFound.jsx';
import Home from '../features/home/Home.jsx';
import { AuthContext } from './app.jsx';

const PrivateRoute = ({ element }) => {
  const auth = useContext(AuthContext);
  return auth?.user ? element : <Navigate to="/" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/home" element={<PrivateRoute element={<Home />} />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
