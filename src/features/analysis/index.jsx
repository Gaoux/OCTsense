import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, FilePlus2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Analysis = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { imageFile, predictionResult } = location.state || {};

  const categories = [
    {
      name: t('analysis.category1') || 'Macular Degeneration',
      value: predictionResult
        ? (predictionResult.probabilities[0] * 100).toFixed(0)
        : 0,
    },
    {
      name: t('analysis.category2') || 'Diabetic Retinopathy',
      value: predictionResult
        ? (predictionResult.probabilities[1] * 100).toFixed(0)
        : 0,
    },
    {
      name: t('analysis.category3') || 'Glaucoma',
      value: predictionResult
        ? (predictionResult.probabilities[2] * 100).toFixed(0)
        : 0,
    },
    {
      name: t('analysis.category4') || 'Healthy',
      value: predictionResult
        ? (predictionResult.probabilities[3] * 100).toFixed(0)
        : 0,
    },
  ];
  const [progressAnimated, setProgressAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setProgressAnimated(true), 100); // slight delay
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateReport = () => {
    console.log('Generating report...');
    // You could navigate to /generate-report or trigger a backend service
  };

  if (!imageFile || !predictionResult) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-very-light-gray'>
        <h2 className='text-2xl font-bold text-gray-700'>
          {t('analysis.no_data_found')}
        </h2>
        <p className='text-gray-500 mt-2'> {t('analysis.upload_first')}</p>
      </div>
    );
  }

  return (
    <div id='webcrumbs'>
      <div className="w-[1200px] p-6 bg-[#faf8f8] font-['Open_Sans',_sans-serif] text-gray-800 mx-auto">
        {/* Header */}
        <header className='flex items-center justify-center mb-8'>
          <div className='bg-green-100 p-2 rounded-full mr-3'>
            <CheckCircle className='h-6 w-6 text-green-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-800'>
            {t('analysis.results')}
          </h1>
        </header>

        {/* Main Card */}
        <div className='bg-white rounded-xl shadow-md p-8 mb-8 transition-all duration-300 hover:shadow-lg'>
          {/* Diagnosis Header */}
          <div className='text-center mb-8'>
            <p className='text-gray-600 mb-2'>
              {t('analysis.primary_diagnosis')}
            </p>
            <h2 className='text-3xl font-bold text-primary'>
              {predictionResult.prediction || t('analysis.unknown')}
            </h2>
          </div>

          {/* Grid: Image and Probabilities */}
          <div className='grid md:grid-cols-2 gap-8 mb-8'>
            {/* Uploaded Image */}
            <div className='transition-all duration-500 opacity-0 animate-[fadeIn_1s_ease_forwards]'>
              <div className='bg-very-light-gray p-4 rounded-xl border border-light-gray shadow-sm h-full'>
                <h3 className='font-bold mb-4 text-gray-700'>
                  {t('analysis.original_image')}
                </h3>
                <div className='overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-transform'>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt='Medical OCT Scan'
                    className='w-full h-64 object-cover'
                  />
                </div>
              </div>
            </div>

            {/* Probabilities */}
            <div className='transition-all duration-500 opacity-0 animate-[fadeIn_1.2s_ease_forwards]'>
              <div className='bg-very-light-gray p-4 rounded-xl border border-light-gray shadow-sm h-full'>
                <h3 className='font-bold mb-6 text-gray-700'>
                  {t('analysis.probabilities')}
                </h3>
                <div className='space-y-5'>
                  {categories.map((category, index) => (
                    <div key={index}>
                      <div className='flex justify-between mb-1'>
                        <span>{category.name}</span>
                        <span className='font-semibold text-secondary'>
                          {category.value}%
                        </span>
                      </div>
                      <div className='h-4 w-full bg-light-gray rounded-full overflow-hidden'>
                        <div className='h-4 w-full bg-light-gray rounded-full overflow-hidden'>
                          <div
                            className='h-full bg-secondary rounded-full transition-all duration-1000 ease-out'
                            style={{
                              width: progressAnimated
                                ? `${category.value}%`
                                : '0%',
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Observations */}
          <div className='transition-all duration-500 opacity-0 animate-[fadeIn_1.4s_ease_forwards]'>
            <div className='bg-very-light-gray p-6 rounded-xl border border-light-gray shadow-sm mb-8'>
              <h3 className='font-bold mb-4 text-gray-700'>
                {t('analysis.observations')}
              </h3>
              <textarea
                className='w-full p-4 border bg-white border-light-gray rounded-lg h-32 focus:ring-4 focus:ring-light-secondary focus:border-transparent outline-none transition-all duration-300'
                placeholder={t('analysis.comments_placeholder')}
              ></textarea>
              <div className='mt-4 flex justify-end'></div>
            </div>
          </div>

          {/* Generate Report Button */}
          <div className='flex justify-center mt-8 transition-all duration-500 opacity-0 animate-[fadeIn_1.6s_ease_forwards]'>
            <button
              onClick={handleGenerateReport}
              className='px-6 gap-2 py-3 bg-primary text-white rounded-lg hover:bg-dark-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center'
            >
              <FilePlus2 className='w-6 h-6' />
              {t('analysis.save_report')}
            </button>
          </div>
        </div>

        {/* Tailwind Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes progressBar {
            from {
              width: 0;
            }
            to {
              width: var(--width);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Analysis;
