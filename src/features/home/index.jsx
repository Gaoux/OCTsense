import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, BarChart3, FileText, ScanLine } from 'lucide-react';
import HomePageFAQ from '../../components/u-i/homePageFAQ';
import redFondo from '../../assets/fondo-red.png';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='fixed top-20 right-0 lg:right-30 w-64 md:w-80 lg:w-166 pointer-events-none opacity-40 select-none z-[-1] hidden md:block'>
        <img
          src={redFondo}
          alt='Background Globe'
          className='w-full h-auto object-contain'
        />
      </div>

      <div className='w-[1200px] p-6 mx-auto'>
        {/* Hero Section */}
        <header className='flex flex-col lg:flex-row items-center justify-between py-16 mb-20'>
          <div className='w-full lg:w-1/2 pr-0 lg:pr-10 mb-10 lg:mb-0'>
            <h1 className='text-4xl md:text-5xl font-bold text-blue-800 mb-6 leading-tight'>
              {t('home.heroTitle')}
            </h1>
            <p className='text-lg text-gray-700 mb-8 leading-relaxed'>
              {t('home.heroDescription')}
            </p>
            <button
              onClick={() => navigate('/upload')}
              className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center'
            >
              <span>{t('home.getStarted')}</span>
            </button>
          </div>

          {/* Hero Background Globe */}
          <div className='w-full lg:w-1/2 relative'>
            <div className='relative w-full h-[400px] rounded-xl overflow-hidden shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1618249987208-1dca78ad5a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxvcGh0aGFsbW9sb2d5fGVufDB8fHx8MTc0NTg1MjE4NHww&ixlib=rb-4.0.3&q=80&w=1080'
                alt={t('home.heroAlt')}
                className='w-full h-full object-contain rounded-xl'
              />
            </div>
          </div>
        </header>

        {/* Benefits Section */}
        <section className='py-16 mb-20'>
          <div className='text-center mb-14'>
            <h2 className='text-3xl font-bold text-blue-800 mb-4'>
              {t('home.benefitsTitle')}
            </h2>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
              {t('home.benefitsDescription')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:bg-blue-50 border border-gray-100 transition-transform duration-300 hover:-translate-y-1'
              >
                <div className='flex justify-center mb-4'>
                  {index === 1 && (
                    <Upload className='w-10 h-10 text-blue-600' />
                  )}
                  {index === 2 && (
                    <BarChart3 className='w-10 h-10 text-blue-600' />
                  )}
                  {index === 3 && (
                    <FileText className='w-10 h-10 text-blue-600' />
                  )}
                  {index === 4 && (
                    <Upload className='w-10 h-10 text-blue-600' />
                  )}{' '}
                  {/* Placeholder, change icon if needed */}
                </div>
                <h3 className='text-xl font-semibold mb-3 text-blue-800 text-center'>
                  {t(`home.benefit${index}.title`)}
                </h3>
                <p className='text-gray-600 text-center'>
                  {t(`home.benefit${index}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Video Section */}
        <section className='py-16 mb-20 bg-blue-50 rounded-2xl p-10'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-blue-800 mb-4'>
              {t('home.videoTitle')}
            </h2>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
              {t('home.videoDescription')}
            </p>
          </div>

          <div className='max-w-4xl mx-auto'>
            <div className='relative w-full h-[400px] rounded-xl overflow-hidden shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxtZWRpY2FsfGVufDB8fHx8MTc0NTg1MjIxNXww&ixlib=rb-4.0.3&q=80&w=1080'
                alt={t('home.videoAlt')}
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className='py-16 mb-20'>
          <div className='text-center mb-14'>
            <h2 className='text-3xl font-bold text-blue-800 mb-4'>
              {t('home.howItWorksTitle')}
            </h2>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
              {t('home.howItWorksDescription')}
            </p>
          </div>

          <div className='flex flex-col md:flex-row items-center justify-between gap-8 relative'>
            {/* Connection Lines (Desktop Only) */}
            <div className='hidden md:block absolute top-1/3 left-[28%] w-[20%] h-[3px] bg-blue-200 z-0'></div>
            <div className='hidden md:block absolute top-1/3 right-[28%] w-[20%] h-[3px] bg-blue-200 z-0'></div>

            {/* Step 1 */}
            <div className='relative w-full md:w-1/3 bg-white rounded-xl shadow-lg p-8 z-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group border border-gray-100'>
              <div className='absolute -top-5 -left-5 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:bg-blue-700 transition-colors duration-300'>
                1
              </div>
              <div className='flex justify-center mb-6'>
                <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300'>
                  <Upload className='w-10 h-10 text-blue-600' />
                </div>
              </div>
              <h3 className='text-xl font-semibold mb-3 text-center text-blue-800'>
                {t('home.step1.title')}
              </h3>
              <p className='text-gray-600 text-center'>
                {t('home.step1.description')}
              </p>
            </div>

            {/* Step 2 */}
            <div className='relative w-full md:w-1/3 bg-white rounded-xl shadow-lg p-8 z-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group border border-gray-100'>
              <div className='absolute -top-5 -left-5 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:bg-blue-700 transition-colors duration-300'>
                2
              </div>
              <div className='flex justify-center mb-6'>
                <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300'>
                  <ScanLine className='w-10 h-10 text-blue-600' />
                </div>
              </div>
              <h3 className='text-xl font-semibold mb-3 text-center text-blue-800'>
                {t('home.step2.title')}
              </h3>
              <p className='text-gray-600 text-center'>
                {t('home.step2.description')}
              </p>
            </div>

            {/* Step 3 */}
            <div className='relative w-full md:w-1/3 bg-white rounded-xl shadow-lg p-8 z-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group border border-gray-100'>
              <div className='absolute -top-5 -left-5 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:bg-blue-700 transition-colors duration-300'>
                3
              </div>
              <div className='flex justify-center mb-6'>
                <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300'>
                  <FileText className='w-10 h-10 text-blue-600' />
                </div>
              </div>
              <h3 className='text-xl font-semibold mb-3 text-center text-blue-800'>
                {t('home.step3.title')}
              </h3>
              <p className='text-gray-600 text-center'>
                {t('home.step3.description')}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <HomePageFAQ />
      </div>
    </div>
  );
};

export default LandingPage;
