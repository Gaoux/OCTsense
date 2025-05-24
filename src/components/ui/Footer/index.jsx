import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className='bg-very-dark-secondary text-white py-8 px-4 md:px-8'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* Logo y Universidad */}
        <div className='flex flex-col items-start'>
          <div className='flex items-center mb-4'>
            <img
              src='/logo-no-background.svg'
              className='h-8 mr-2'
              alt='OCTsense Logo'
            />
            <span className='text-xl font-semibold'>OCTsense</span>
          </div>
          <p className='text-gray-300 mb-4'>{t('footer.project_by')}</p>
          <div className='flex items-center gap-2 text-gray-300'>
            <MapPin className='w-4 h-4' />
            <span>Pontificia Universidad Javeriana</span>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>
            {t('footer.quick_links')}
          </h3>
          <ul className='space-y-2'>
            <li>
              <Link to={ROUTES.HOME} className='text-gray-300 hover:text-white'>
                {t('navbar.home')}
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.UPLOAD}
                className='text-gray-300 hover:text-white'
              >
                {t('navbar.upload')}
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ANALYSIS}
                className='text-gray-300 hover:text-white'
              >
                {t('navbar.analysis')}
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.REPORTS}
                className='text-gray-300 hover:text-white'
              >
                {t('navbar.report')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>{t('footer.contact')}</h3>
          <ul className='space-y-2 text-gray-300'>
            <li className='flex items-center gap-2'>
              <Mail className='w-4 h-4' />
              contacto@octsense.com
            </li>
            <li className='flex items-center gap-2'>
              <Phone className='w-4 h-4' />
              +57 123 456 7890
            </li>
          </ul>
        </div>

        {/* Redes sociales y repositorio */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>
            {t('footer.follow_us')}
          </h3>
          <div className='flex gap-4 mb-4'>
            <a href='#' className='text-gray-300 hover:text-white'>
              <Facebook className='w-5 h-5' />
            </a>
            <a href='#' className='text-gray-300 hover:text-white'>
              <Twitter className='w-5 h-5' />
            </a>
            <a href='#' className='text-gray-300 hover:text-white'>
              <Linkedin className='w-5 h-5' />
            </a>
          </div>
          <div className='flex items-center gap-2 text-gray-300'>
            <Github className='w-4 h-4' />
            <a
              href='https://github.com/Gaoux/OCTsense'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-white'
            >
              {t('footer.view_code')}
            </a>
          </div>
        </div>
      </div>

      {/* Derechos de autor */}
      <div className='border-t border-gray-700 mt-8 pt-6 text-center text-gray-400'>
        <p>
          © {new Date().getFullYear()} OCTsense - {t('footer.all_rights')}
        </p>
        <p className='text-sm mt-2'>{t('footer.disclaimer')}</p>
      </div>
    </footer>
  );
}
