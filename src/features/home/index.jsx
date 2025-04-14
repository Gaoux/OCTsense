import React from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaMicroscope, FaFileAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import redFondo from '../../assets/fondo-red.png';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className='bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen pt-20 relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6 py-10 relative z-10'>
        <section className='relative grid grid-cols-1 md:grid-cols-2 items-center gap-10 mb-28 z-20'>
          <div>
            <h1 className='text-4xl font-bold text-blue-800 mb-4'>
              {t('home.title')} <span className='text-blue-900'>OCTsense</span>
            </h1>
            <p className='text-gray-800 max-w-xl text-lg'>
              {t('home.description')}
            </p>
          </div>

          {/* Imagen  */}
          <div className='flex justify-center md:justify-end relative'>
            <img
              src={redFondo}
              alt='Vector tecnológico'
              className='w-[220%] max-w-xl md:absolute md:bottom-[-330px] md:right-[-50px] opacity-90 pointer-events-none select-none'
            />
          </div>
        </section>

        {/* Beneficios + Guía interactiva */}
        <div className='grid md:grid-cols-2 gap-6 mb-10 relative z-30'>
          {/* Beneficios */}
          <div className='bg-white rounded-2xl shadow-lg p-6'>
            <h2 className='text-xl font-semibold text-blue-700 mb-4'>
              {t('home.benefits.title')}
            </h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2 text-base'>
              <li>{t('home.benefits.diagnosis')}</li>
              <li>{t('home.benefits.reduction')}</li>
              <li>{t('home.benefits.compatibility')}</li>
              <li className='flex items-center gap-2'>
                <FaLock className='text-blue-600' />{' '}
                {t('home.benefits.security')}
              </li>
            </ul>
            <div className='mt-6'>
              <button
                className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all'
                onClick={() => navigate(isAuthenticated ? '/report' : '/login')}
              >
                {t('home.try_it')}
              </button>
            </div>
          </div>

          {/* Guía interactiva */}
          <div className='bg-blue-100 rounded-2xl shadow-lg p-6'>
            <h2 className='text-xl font-semibold text-blue-800 mb-6'>
              {t('home.interactive_guide')}
            </h2>
            <div className='grid md:grid-cols-3 gap-4'>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className='bg-white p-4 rounded-xl shadow text-center transition-all'
              >
                <FaUpload className='text-blue-600 text-3xl mx-auto mb-2' />
                <h3 className='text-red-500 font-semibold'>
                  {t('home.guide.upload')}
                </h3>
                <p className='text-gray-600 text-sm'>
                  {t('home.guide.upload_description')}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className='bg-white p-4 rounded-xl shadow text-center transition-all'
              >
                <FaMicroscope className='text-blue-600 text-3xl mx-auto mb-2' />
                <h3 className='text-red-500 font-semibold'>
                  {t('home.guide.analysis')}
                </h3>
                <p className='text-gray-600 text-sm'>
                  {t('home.guide.analysis_description')}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className='bg-white p-4 rounded-xl shadow text-center transition-all'
              >
                <FaFileAlt className='text-blue-600 text-3xl mx-auto mb-2' />
                <h3 className='text-red-500 font-semibold'>
                  {t('home.guide.report')}
                </h3>
                <p className='text-gray-600 text-sm'>
                  {t('home.guide.report_description')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
