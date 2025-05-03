import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, BarChart3, FileText, ScanLine } from 'lucide-react';
import HomePageFAQ from '../../components/ui/homePageFAQ';
import redFondo from '../../assets/fondo-red.png';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='relative'>
      {/* Background Image */}
      <div className='fixed top-20 right-0 lg:right-32 w-48 md:w-72 lg:w-[28rem] pointer-events-none opacity-30 select-none z-[-1] hidden md:block'>
        <img
          src={redFondo}
          alt='Background Globe'
          className='w-full h-auto object-contain'
        />
      </div>

      <div className='max-w-[1200px] w-full px-4 sm:px-6 lg:px-8 mx-auto'>
        {/* Hero Section */}
        <header className='flex flex-col lg:flex-row items-center justify-between py-10 md:py-16 mb-16'>
          {/* Text */}
          <div className='w-full lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-dark-secondary mb-6 leading-tight'>
              {t('home.heroTitle')}
            </h1>
            <p className='text-base md:text-lg text-gray-700 mb-8 leading-relaxed'>
              {t('home.heroDescription')}
            </p>
            <div className='flex justify-center lg:justify-start'>
              <button
                onClick={() => navigate('/upload')}
                className='bg-dark-secondary hover:bg-accent-hover text-white font-semibold py-3 px-6 md:px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center'
              >
                <span>{t('home.getStarted')}</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className='w-full lg:w-1/2'>
            <div className='relative w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1618249987208-1dca78ad5a47?...'
                alt={t('home.heroAlt')}
                className='w-full h-full object-contain rounded-xl'
              />
            </div>
          </div>
        </header>

        {/* Benefits Section */}
        <section className='py-10 md:py-16 mb-20'>
          <div className='text-center mb-14'>
            <h2 className='text-3xl font-bold text-blue-800 mb-4'>
              {t('home.benefitsTitle')}
            </h2>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl mx-auto'>
              {t('home.benefitsDescription')}
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:bg-blue-50 border border-gray-100 transition-transform duration-300 hover:-translate-y-1 text-center'
              >
                <div className='flex justify-center mb-4'>
                  {index === 1 && <Upload className='w-8 h-8 text-blue-600' />}
                  {index === 2 && (
                    <BarChart3 className='w-8 h-8 text-blue-600' />
                  )}
                  {index === 3 && (
                    <FileText className='w-8 h-8 text-blue-600' />
                  )}
                  {index === 4 && <Upload className='w-8 h-8 text-blue-600' />}
                </div>
                <h3 className='text-xl font-semibold mb-3 text-blue-800'>
                  {t(`home.benefit${index}.title`)}
                </h3>
                <p className='text-gray-600'>
                  {t(`home.benefit${index}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Video Section */}
        <section className='py-10 md:py-16 mb-20 bg-blue-50 rounded-2xl px-6 md:px-10'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-blue-800 mb-4'>
              {t('home.videoTitle')}
            </h2>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl mx-auto'>
              {t('home.videoDescription')}
            </p>
          </div>

          <div className='w-full max-w-4xl mx-auto'>
            <div className='relative w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?...'
                alt={t('home.videoAlt')}
                className='w-full h-full object-cover rounded-xl'
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className='py-10 md:py-16 mb-20'>
          <div className='text-center mb-14'>
            <h2 className='text-3xl font-bold text-blue-800 mb-4'>
              {t('home.howItWorksTitle')}
            </h2>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl mx-auto'>
              {t('home.howItWorksDescription')}
            </p>
          </div>

          <div className='flex flex-col md:flex-row items-center justify-between gap-6 relative'>
            {/* Connection Lines (Desktop Only) */}
            <div className='hidden md:block absolute top-1/3 left-[28%] w-[20%] h-[2px] bg-dark-primary z-0'></div>
            <div className='hidden md:block absolute top-1/3 right-[28%] w-[20%] h-[2px] bg-dark-primary z-0'></div>

            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className='relative flex-1 min-h-[242px] max-w-[350px] w-full bg-white rounded-xl shadow-lg p-8 z-10 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between text-center'
              >
                <div>
                  <div className='absolute -top-5 -left-5 w-10 h-10 bg-blue-600 text-white font-bold text-lg rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-700 transition-colors duration-300'>
                    {step}
                  </div>
                  <div className='flex justify-center mb-6'>
                    <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300'>
                      {step === 1 && (
                        <Upload className='w-10 h-10 text-blue-600' />
                      )}
                      {step === 2 && (
                        <ScanLine className='w-10 h-10 text-blue-600' />
                      )}
                      {step === 3 && (
                        <FileText className='w-10 h-10 text-blue-600' />
                      )}
                    </div>
                  </div>
                  <h3 className='text-xl font-semibold mb-3 text-blue-800'>
                    {t(`home.step${step}.title`)}
                  </h3>
                  <p className='text-gray-600 leading-snug h-[48px] flex items-center text-center'>
                    {t(`home.step${step}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <HomePageFAQ />
      </div>
    </div>
  );
};

export default LandingPage;
