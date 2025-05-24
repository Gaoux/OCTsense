import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { predictOCT } from '../../api/octService';
import {
  UploadCloud,
  Upload as UploadIcon,
  Image as ImageIcon,
  Scissors,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CropModal from '../../components/ui/cropModal';
import { motion } from 'framer-motion';

const Upload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showCropModal, setShowCropModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setError(null);
    }
  };

  const updateImage = (croppedFile) => {
    setImageFile(croppedFile);
    setShowCropModal(false);
  };
  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      setImageFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError(t('upload.no_image_error'));
      return;
    }

    setError(null);
    setPredictionResult(null);
    setLoading(true);

    try {
      const result = await predictOCT(imageFile);
      setPredictionResult(result);

      const destino = user?.role === 'professional' ? '/analysis' : '/analysis';

      navigate(destino, {
        state: {
          imageFile,
          predictionResult: result,
        },
      });
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || t('upload.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className='min-h-screen py-12 px-4 sm:px-6 lg:px-8'
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut', delay: 0.2 }}
        className='max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden'
      >
        {/* Header */}
        <div className='bg-very-dark-secondary px-6 py-6'>
          <div className='flex items-center justify-center gap-3'>
            <div className='bg-white p-2 rounded-full shadow-md'>
              <UploadIcon className='h-6 w-6 text-very-dark-secondary' />
            </div>
            <h1 className='text-2xl md:text-3xl font-bold text-white'>
              {t('upload.title')}
            </h1>
          </div>
        </div>

        <div className='p-8 w-full flex flex-col gap-0'>
          <div className='bg-very-light-gray p-8 rounded-t-2xl shadow-lg flex flex-col md:flex-row gap-8 border border-light-gray'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className='flex basis-[33%] flex-col justify-center gap-4 md:mb-0 mb-5'
            >
              <div className='flex flex-col items-center gap-3 md:mb-0 mb-20'>
                <h3 className='text-dark-primary font-semibold text-2xl text-center mt-4'>
                  {t('upload.subtitle2')}
                </h3>
                {imageFile && (
                  <p className='text-light-primary text-xs text-center break-words max-w-full px-4'>
                    {imageFile.name}
                  </p>
                )}
              </div>
              <div className='mt-auto'>
                {error && (
                  <p className='text-delete text-center mb-2'>{error}</p>
                )}
                <button
                  onClick={() => document.getElementById('image')?.click()}
                  className='w-full flex items-center justify-center bg-white border border-gray-300 text-dark-secondary gap-2 py-2 px-4 rounded-lg shadow-sm \
                  cursor-pointer hover:border-gray-400 transition-all font-medium'
                >
                  <ImageIcon size={20} />
                  {t('upload.buttonUpload')}
                </button>
                <input
                  type='file'
                  id='image'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileChange}
                  data-testid='file-input'
                />
              </div>
              <button
                onClick={() => setShowCropModal(true)}
                disabled={!imageFile}
                className={`w-full flex items-center justify-center bg-white border border-gray-300 hover:border-gray-400 gap-2 py-2 px-4 rounded-lg shadow-sm transition-all font-medium
                    ${
                      imageFile
                        ? 'bg-gray-50 hover:bg-gray-100 text-dark-secondary cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
              >
                <Scissors size={18} />
                {t('crop.button')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-dark-secondary text-white py-2 px-4 rounded-lg shadow-md hover:bg-secondary
                  transition-all duration-300 hover:shadow-lg transform font-semibold mt-2 ${
                    loading
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:bg-accent-hover cursor-pointer'
                  }`}
                data-testid='submit-button'
              >
                {loading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <svg
                      className='animate-spin h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z'
                      ></path>
                    </svg>
                    {t('upload.buttonAnalyze')}
                  </div>
                ) : (
                  t('upload.buttonAnalyze')
                )}
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className='flex-[1.5] min-h-[10rem] md:h-110 flex items-center justify-center rounded-lg border transition-all \
              border-dashed border-gray-300 bg-white'
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt='Preview'
                  className='max-h-full w-full object-contain rounded-lg shadow-md'
                />
              ) : (
                <span className='text-gray-400 text-center px-4 flex flex-col items-center'>
                  <UploadCloud size={40} className='mb-2' />
                  {t('upload.uploadPrompt')}
                </span>
              )}
            </motion.div>
          </div>
          <div className='bg-primary text-white py-2 px-4 rounded-b-2xl border-t border-gray-800 mt-0'>
            {t('upload.formats')}
          </div>
        </div>
        {/* Crop Modal */}
        {showCropModal && (
          <CropModal
            updateImage={updateImage}
            closeModal={() => setShowCropModal(false)}
            imageFile={imageFile}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Upload;
