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
import {
  Home,
  Upload,
  BarChart3,
  FileText,
  Globe,
  ChevronDown,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';

export function NavbarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar fluid className='py-2 '>
      <Link to='/' className='flex items-center'>
        <img
          src='/logo-no-background.svg'
          className='mr-3 h-6 sm:h-8 lg :h-9 w-auto'
          alt='Logo'
        />
        <span className='self-center whitespace-nowrap text-xl md:text-2xl font-semibold dark:text-white'>
          OCTSense
        </span>
      </Link>

      <div className='flex md:order-2 py-2 gap-1 lg:gap-3 items-center '>
        {/* Language Selector */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div
              className='flex items-center gap-1 text-white cursor-pointer  hover:opacity-90'
              onClick={() => setLanguageOpen((prev) => !prev)}
            >
              <Globe className='w-5 h-5' />
              <ChevronDown className={`w-4 h-4 `} />
            </div>
          }
          onBlur={() => setLanguageOpen(false)}
        >
          <DropdownItem onClick={() => changeLanguage('en')}>EN</DropdownItem>
          <DropdownItem onClick={() => changeLanguage('es')}>ES</DropdownItem>
        </Dropdown>

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
              <span className='block text-sm'>
                {user?.name || t('navbar.user')}
              </span>
              <span className='block truncate text-sm font-medium'>
                {user?.email || t('navbar.email')}
              </span>
            </DropdownHeader>
            <Link to='/upload'>
              <DropdownItem>{t('navbar.upload')}</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout}>
              {t('navbar.logout')}
            </DropdownItem>
          </Dropdown>
        ) : (
          <Button
            as={Link}
            to='/login'
            style={{ backgroundColor: 'var(--color-secondary)' }}
            className='text-base lg:text-lg flex gap-1 lg:gap-2 text-center sm:p-[20px] p-[15px]'
          >
            <div className='flex text-center items-center gap-2 overflow-hidden'>
              <LogIn className='flex sm:hidden sm:w-4 sm:h-4 lg:w-5 lg:h-5 max-w-full max-h-full  sm:mx-0' />
              <span className='sm:flex hidden'> {t('navbar.login')}</span>
            </div>
          </Button>
        )}
        <NavbarToggle />
      </div>

      {/* <NavbarCollapse className='md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:w-max'> */}
      {/* <NavbarCollapse className='ml-auto'> */}
      <NavbarCollapse className='flex-grow items-center lg:max-w-[50%] md:max-w-[30%] '>
        <div className='md:flex  md:gap-3 lg:gap-8 items-center py-4 text-base lg:text-lg md:flex-grow md:justify-between'>
          <NavbarLink as={Link} to='/' active={isActive('/')}>
            <div className='flex items-center gap-2'>
              <Home className='w-4 h-4 md:w-6 md:h-6 lg:w-5 lg:h-5' />
              <span className='hidden lg:inline'>{t('navbar.home')}</span>
            </div>
          </NavbarLink>

          <NavbarLink
            as={Link}
            to={isAuthenticated ? '/upload' : '/login'}
            active={isActive('/upload')}
          >
            <div className='flex items-center gap-2'>
              <Upload className='w-4 h-4 md:w-6 md:h-6 lg:w-5 lg:h-5' />
              <span className='hidden lg:inline'>{t('navbar.upload')}</span>
            </div>
          </NavbarLink>

          <NavbarLink
            as={Link}
            to={isAuthenticated ? '/analysis' : '/login'}
            active={isActive('/analysis')}
          >
            <div className='flex items-center gap-2'>
              <BarChart3 className='w-4 h-4 md:w-6 md:h-6 lg:w-5 lg:h-5' />
              <span className='hidden lg:inline'>{t('navbar.analysis')}</span>
            </div>
          </NavbarLink>

          <NavbarLink
            as={Link}
            to={isAuthenticated ? '/report' : '/login'}
            active={isActive('/report')}
          >
            <div className='flex items-center gap-2'>
              <FileText className='w-4 h-4 md:w-6 md:h-6 lg:w-5 lg:h-5' />
              <span className='hidden lg:inline'>{t('navbar.report')}</span>
            </div>
          </NavbarLink>
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}
