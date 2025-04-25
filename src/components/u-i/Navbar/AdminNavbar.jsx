import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Home, Users, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './styles.css';

export function AdminNavbar() {
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar
      fluid
      className="py-2 bg-very-dark-secondary dark:bg-very-dark-secondary"
    >
      <Link to="/dashboard" className="flex items-center">
        <img
          src="/logo-no-background.svg"
          className="mr-3 h-6 sm:h-8 lg:h-9 w-auto"
          alt="Logo"
        />
        <span className="self-center whitespace-nowrap text-white md:text-2xl font-semibold">
          OCTsense
        </span>
      </Link>

      <div className="flex md:order-2 py-2 gap-1 lg:gap-3 items-center">
        {isAuthenticated ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User avatar"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm font-bold text-gray-900 dark:text-white">
                {user?.name || 'Usuario'}
              </span>
              <span className="block truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {user?.email || 'email@example.com'}
              </span>
            </DropdownHeader>
            <Link to="/settings">
              <DropdownItem>Configuración</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout}>Cerrar sesión</DropdownItem>
          </Dropdown>
        ) : (
          <Button
            as={Link}
            to="/login"
            style={{ backgroundColor: 'var(--color-secondary)' }}
            className="text-base lg:text-lg flex gap-1 lg:gap-2 text-center sm:p-[20px] p-[15px] text-white"
          >
            <div className="flex text-center items-center gap-2 overflow-hidden">
              <LogIn className="flex sm:hidden sm:w-4 sm:h-4 lg:w-5 lg:h-5 max-w-full max-h-full sm:mx-0" />
              <span className="sm:flex hidden">Iniciar sesión</span>
            </div>
          </Button>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse className="flex-grow items-center lg:max-w-[50%] md:max-w-[30%]">
        <div className="md:flex md:gap-3 lg:gap-8 items-center py-4 text-base lg:text-lg md:flex-grow md:justify-between">
          <NavbarLink
            as={Link}
            to="/admin-dashboard"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4 md:w-6 md:h-6 lg:w-5 lg:h-5 text-white" />
            <span className="text-white">Dashboard</span>
          </NavbarLink>

          <NavbarLink
            as={Link}
            to="/usuarios"
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4 md:w-6 md:h-6 lg:w-5 lg:h-5 text-white" />
            <span className="text-white">Usuarios</span>
          </NavbarLink>

          <NavbarLink
            as={Link}
            to="/registrar"
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 md:w-6 md:h-6 lg:w-5 lg:h-5 text-white" />
            <span className="text-white">Registrar</span>
          </NavbarLink>
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}

export default AdminNavbar;