import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  Button,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { Home, Upload, BarChart3, FileText } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export function NavbarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar fluid className='py-2 '>
      <Link to='/' className='flex items-center '>
        <img
          src='/logo-no-background.svg'
          className='mr-3 h-6 sm:h-9 w-auto'
          alt='Logo'
        />
        <span className=' self-center whitespace-nowrap text-2xl font-semibold dark:text-white'>
          OCTSense
        </span>
      </Link>

      <div className='flex md:order-2 py-2 '>
        {isAuthenticated ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt='User avatar'
                img='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className='block text-sm'>{user?.name || 'User'}</span>
              <span className='block truncate text-sm font-medium'>
                {user?.email || 'email@example.com'}
              </span>
            </DropdownHeader>
            <Link to='/upload'>
              <DropdownItem>Upload</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Button
            as={Link}
            to='/login'
            style={{ backgroundColor: 'var(--color-secondary)' }}
            className='text-lg'
          >
            Login
          </Button>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <div className='md:flex gap-5 text-lg items-center py-4'>
          <Link to='/'>
            <NavbarLink active={isActive('/')}>
              <div className='flex items-center gap-2'>
                <Home size={18} />
                Inicio
              </div>
            </NavbarLink>
          </Link>
          <Link to={isAuthenticated ? '/upload' : '/login'}>
            <NavbarLink active={isActive('/upload')}>
              <div className='flex items-center gap-2'>
                <Upload size={18} />
                Carga
              </div>
            </NavbarLink>
          </Link>
          <Link to={isAuthenticated ? '/analysis' : '/login'}>
            <NavbarLink active={isActive('/analysis')}>
              <div className='flex items-center gap-2'>
                <BarChart3 size={18} />
                Análisis
              </div>
            </NavbarLink>
          </Link>
          <Link to={isAuthenticated ? '/report' : '/login'}>
            <NavbarLink active={isActive('/report')}>
              <div className='flex items-center gap-2'>
                <FileText size={18} />
                Informe
              </div>
            </NavbarLink>
          </Link>
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}
