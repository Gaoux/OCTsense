import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../features/Login/login_temp.jsx';
import Register from '../features/Register/register_temp.jsx';
import NotFound from '../features/not-found/NotFound.jsx';
import Home from '../features/home/Home.jsx';
import Upload from '../features/upload/Upload.jsx';
import Analysis from '../features/analysis/index.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/home' element={<Home />} />
    <Route path='/upload' element={<Upload />} />
    <Route path='/analysis' element={<Analysis />} />
    <Route path='*' element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
