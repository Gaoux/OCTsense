import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
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
  Users,
  UserPlus,
  LineChart,
  LogIn,
  User,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import './styles.css';
import { ROUTES } from '../../../constants/routes';

export function NavbarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated, isPatient } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path) => location.pathname === path;
  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const links_common = [
    {
      path: ROUTES.HOME,
      icon: <Home className='icon-style' />,
      label: t('navbar.home'),
      protected: false,
    },
    {
      path: ROUTES.UPLOAD,
      icon: <Upload className='icon-style' />,
      label: t('navbar.upload'),
      protected: true,
    },
    {
      path: ROUTES.ANALYSIS,
      icon: <BarChart3 className='icon-style' />,
      label: t('navbar.analysis'),
      protected: true,
    },
    {
      path: ROUTES.REPORTS,
      icon: <FileText className='icon-style' />,
      label: t('navbar.report'),
      protected: true,
      condition: () => !isPatient(),
    },
  ];

  const links_admin = [
    {
      path: ROUTES.ADMIN_DASHBOARD,
      icon: <Home className='icon-style' />,
      label: t('navbar.dashboard'),
      protected: true,
    },
    {
      path: ROUTES.ADMIN_USERS,
      icon: <Users className='icon-style' />,
      label: t('navbar.users'),
      protected: true,
    },
    {
      path: ROUTES.ADMIN_KPIS,
      icon: <LineChart className='icon-style' />,
      label: t('navbar.kpis'),
      protected: true,
    },
    {
      path: ROUTES.REPORTS,
      icon: <FileText className='icon-style' />,
      label: t('navbar.report'),
      protected: true,
      condition: () => !isPatient(),
    },
  ];

  const selectedLinks = user?.role === 'admin' ? links_admin : links_common;

  return (
    <Navbar
      fluid
      className='py-2 bg-very-dark-secondary dark:bg-very-dark-secondary navbar-shadow sticky top-0 z-50'
    >
      <Link to={ROUTES.HOME} className='flex items-center'>
        <img
          src='/logo-no-background.svg'
          className='mr-3 h-6 sm:h-8 lg:h-9 w-auto'
          alt='Logo'
        />
        <span className='self-center whitespace-nowrap text-white md:text-2xl font-semibold'>
          OCTSense
        </span>
      </Link>

      <div className='flex md:order-2 py-2 gap-1 lg:gap-3 items-center'>
        <Dropdown
          arrowIcon={false}
          inline
          className='dropdown-style'
          label={
            <div className='flex items-center gap-1 text-white cursor-pointer hover:opacity-90'>
              <Globe className='w-5 h-5' />
              <ChevronDown className='w-4 h-4' />
            </div>
          }
        >
          <DropdownItem onClick={() => changeLanguage('en')}>EN</DropdownItem>
          <DropdownItem onClick={() => changeLanguage('es')}>ES</DropdownItem>
        </Dropdown>

        {isAuthenticated ? (
          <Dropdown
            arrowIcon={false}
            inline
            className='dropdown-style'
            label={
              <div className='w-8 h-8 flex items-center justify-center bg-white rounded-full'>
                <User className='text-gray-800 w-5 h-5' />
              </div>
            }
          >
            <DropdownHeader>
              <span className='block text-sm font-bold text-white'>
                {user?.name || t('navbar.user')}
              </span>
              <span className='block truncate text-sm font-medium text-very-light-secondary'>
                {user?.email || t('navbar.email')}
              </span>
            </DropdownHeader>
            <Link to={ROUTES.SETTINGS}>
              <DropdownItem>{t('navbar.settings')}</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout}>
              {t('navbar.logout')}
            </DropdownItem>
          </Dropdown>
        ) : (
          <Button
            as={Link}
            to={ROUTES.LOGIN}
            style={{ backgroundColor: 'var(--color-secondary)' }}
            className='text-base lg:text-lg flex gap-1 lg:gap-2 text-center sm:p-[20px] p-[15px] text-white'
          >
            <div className='flex text-center items-center gap-2 overflow-hidden'>
              <LogIn className='flex sm:hidden sm:w-4 sm:h-4 lg:w-5 lg:h-5' />
              <span className='sm:flex hidden'>{t('navbar.login')}</span>
            </div>
          </Button>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse className='flex-grow items-center lg:max-w-[50%] md:max-w-[30%]'>
        <div className='md:flex md:gap-3 lg:gap-8 items-center py-4 text-base lg:text-lg md:flex-grow md:justify-between'>
          {selectedLinks.map(
            ({ path, icon, label, protected: isProtected, condition }) => {
              const shouldShow =
                (!isProtected || isAuthenticated) &&
                (condition ? condition() : true);
              return (
                shouldShow && (
                  <NavbarLink
                    key={path}
                    as={Link}
                    to={isProtected && !isAuthenticated ? ROUTES.LOGIN : path}
                    active={isActive(path)}
                    className={`flex items-center gap-2 relative ${
                      isActive(path) ? 'active bg-accent' : ''
                    }`}
                  >
                    {icon}
                    <span className='md:hidden lg:inline text-white'>
                      {label}
                    </span>
                  </NavbarLink>
                )
              );
            }
          )}
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}
