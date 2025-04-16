import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { predictOCT } from '../../api/octService';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Upload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setError(null);
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

      const destino =
        user?.role === 'professional' ? '/analysis-oftalmologo' : '/analysis';

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
    <div className='layout-container flex-col'>
      <div className='w-full text-center mt-4 mb-10'>
        <h1 className='text-[50px] font-bold text-black mb-4'>
          {t('upload.title')}
        </h1>
        <p className='text-[20px] text-black opacity-50 max-w-3xl mx-auto'>
          {t('upload.subtitle')}
        </p>
      </div>

      <div className='p-6 w-full max-w-6xl flex flex-col gap-0'>
        <div className='bg-white p-6 rounded-t-lg shadow-lg flex flex-col md:flex-row gap-6 border-[1px] border-gray-200'>
          <div className='flex basis-[33%] flex-col justify-center gap-4 md:mb-0 mb-5'>
            <div className='flex flex-col items-center gap-3 md:mb-0 mb-20'>
              <h3 className='text-gray-700 font-semibold text-3xl text-center mt-4'>
                {t('upload.subtitle2')}
              </h3>
              {imageFile && (
                <p className='text-gray-400 text-sm text-center break-words max-w-full px-4'>
                  {imageFile.name}
                </p>
              )}
            </div>

            <div className='mt-auto'>
              {error && (
                <p className='text-red-400 text-center mb-2'>{error}</p>
              )}
              <button
                onClick={() => document.getElementById('image')?.click()}
                className='w-full relative bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-sm cursor-pointer hover:border-gray-400 transition-all'
              >
                <span className='block text-center w-full'>
                  {t('upload.buttonUpload')}
                </span>
                <ImageIcon
                  className='absolute right-4 top-1/2 -translate-y-1/2'
                  size={20}
                />
              </button>

              <input
                type='file'
                id='image'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg shadow-md transition-colors ${
                loading
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:bg-blue-600 cursor-pointer'
              }`}
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
          </div>

          <div
            className={`flex-[1.5] min-h-[10rem] md:h-110 flex items-center justify-center rounded-lg border transition-all 
    ${
      isDragging
        ? 'border-blue-500 bg-blue-100'
        : 'border-dashed border-gray-300 bg-white'
    }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt='Preview'
                className='max-h-full w-full object-contain rounded-lg'
              />
            ) : (
              <span className='text-gray-400 text-center px-4 flex flex-col items-center'>
                <UploadCloud size={40} className='mb-2' />
                {t('upload.uploadPrompt')}
              </span>
            )}
          </div>
        </div>

        <div className='bg-gray-800 text-white py-2 px-4 rounded-b-lg border-1 border-gray-800'>
          {t('upload.formats')}
        </div>
      </div>
    </div>
  );
};

export default Upload;
