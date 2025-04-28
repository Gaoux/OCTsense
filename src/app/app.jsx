import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from '../context/AuthContext';
import { NavbarComponent } from '../components/u-i/Navbar';

const AppWrapper = () => {
  const location = useLocation();

  // Rutas donde se debe ocultar la barra de navegación
  const hideNavbarOnRoutes = ['/login', '/register'];


  return (
    <>
       <NavbarComponent />
      <AppRoutes />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
