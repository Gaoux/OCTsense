import { useLocation } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './styles.css';

const Analysis = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { imageFile, predictionResult } = location.state || {};

  // Simulamos datos estructurados basados en la imagen de ejemplo
  const categories = [
    {
      name: t('analysis.category1'),
      value: predictionResult?.category1 || '85%',
    },
    {
      name: t('analysis.category2'),
      value: predictionResult?.category2 || '2%',
    },
    {
      name: t('analysis.category3'),
      value: predictionResult?.category3 || '12%',
    },
    {
      name: t('analysis.category4'),
      value: predictionResult?.category4 || '1%',
    },
  ];

  if (!imageFile || !predictionResult) {
    return (
      <div className='layout-container'>
        <div className='error-message'>
          <XCircle size={48} className='error-icon' />
          <h2>{t('analysis.no_data_found')}</h2>
          <p>{t('analysis.upload_first')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='layout-container'>
      <div className='p-6 w-full max-w-4xl flex flex-col gap-6'>
        {/* Result Header */}
        <div className='bg-white p-6 rounded-xl shadow-lg flex items-center gap-4'>
          <CheckCircle size={32} className='text-green-500' />
          <h1 className='text-2xl font-bold text-gray-800'>
            {t('analysis.results')}
          </h1>
        </div>

        {/* Image and Results Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Image Preview */}
          <div className='bg-white p-4 rounded-xl shadow-lg'>
            <h2 className='text-lg font-semibold mb-4 text-gray-700'>
              {t('analysis.original_image')}
            </h2>
            <div className='image-container'>
              <img
                src={URL.createObjectURL(imageFile)}
                alt={t('analysis.original_image')}
                className='rounded-lg border border-gray-200'
              />
            </div>
          </div>

          {/* Results */}
          <div className='bg-white p-4 rounded-xl shadow-lg'>
            <h2 className='text-lg font-semibold mb-4 text-gray-700'>
              {t('analysis.analysis_details')}
            </h2>
            <div className='results-grid'>
              {categories.map((category, index) => (
                <div key={index} className='result-item'>
                  <span className='category-name'>{category.name}</span>
                  <div className='percentage-bar-container'>
                    <div
                      className='percentage-bar'
                      style={{ width: category.value }}
                    ></div>
                  </div>
                  <span className='percentage-value'>{category.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className='bg-blue-100 p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-bold text-blue-700 mb-4'>
            {t('analysis.comments')}
          </h3>
          <textarea
            className='w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            rows={4}
            placeholder={t('analysis.comments')}
          />
          <button className='mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors'>
            {t('analysis.save_comments')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
