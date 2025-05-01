import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from '../context/AuthContext';
import { NavbarComponent } from '../components/ui/Navbar';
import { Footer } from '../components/ui/Footer';

const AppWrapper = () => {
  const location = useLocation();
  const hideOnRoutes = [
    '/login',
    '/register',
    '/registrar',
    '/usuarios',
    '/admin-dashboard',
  ];
  const shouldHide = hideOnRoutes.includes(location.pathname);

  return (
    <div className='flex flex-col min-h-screen'>
      {!shouldHide && <NavbarComponent />}
      <main className='flex-grow'>
        <AppRoutes />
      </main>
      {!shouldHide && <Footer />}
    </div>
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
