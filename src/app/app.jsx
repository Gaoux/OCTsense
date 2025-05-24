import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from '../context/AuthContext';
import { NavbarComponent } from '../components/ui/Navbar';
import { Footer } from '../components/ui/Footer';
import ThemeWrapper from '../components/ui/ThemeWrapper';
import { ROUTES } from '../constants/routes';

const AppWrapper = () => {
  const location = useLocation();
  const hideNavbarOnRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <div className='flex flex-col min-h-screen'>
      {!shouldHideNavbar && <NavbarComponent />}
      <main className='flex-grow'>
        <AppRoutes />
      </main>
      {!shouldHideNavbar && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeWrapper>
          <AppWrapper />
        </ThemeWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
