import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from '../context/AuthContext';
import { NavbarComponent } from '../components/u-i/Navbar';

const AppWrapper = () => {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/login', '/register','/registrar', '/usuarios', '/admin-dashboard'];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

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