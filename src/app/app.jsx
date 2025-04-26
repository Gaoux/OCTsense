import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from '../context/AuthContext';
import { NavbarComponent } from '../components/u-i/Navbar';

const AppWrapper = () => {
  const location = useLocation();

  // Rutas donde se debe ocultar la barra de navegación
  const hideNavbarOnRoutes = ['/login', '/register'];

  // Verifica si la ruta actual coincide con una ruta estática o dinámica
  const shouldHideNavbar =
    hideNavbarOnRoutes.includes(location.pathname) ||
    /^\/editar-usuario\/[a-zA-Z0-9]+$/.test(location.pathname); // Ruta dinámica para /editar-usuario/:id

  return (
    <>
      {!shouldHideNavbar && <NavbarComponent />}
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
