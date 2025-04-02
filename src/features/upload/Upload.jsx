import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { UploadCloud } from 'lucide-react';
import './styles.css';

const Upload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image file.');
      return;
    }

    setError(null);
    setPredictionResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await apiClient.post('/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPredictionResult(response.data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='layout-container'>
      <div className='p-6 w-full max-w-4xl flex flex-col gap-6'>
        {/* Upload Section */}
        <div className='flex gap-6 flex-col'>
          <div className='bg-white p-6 rounded-xl shadow-lg flex-[0.4]'>
            <p className='text-gray-700'>
              Para subir la tomografía de un paciente basta con presionar el
              botón:{' '}
              <span className='text-red-500 font-bold'>
                {' '}
                "Cargar tomografía"{' '}
              </span>
              , dirigirse a la ubicación de la imagen en el explorador de
              archivos, seleccionarla y pulsar{' '}
              <span className='text-blue-500 font-bold'>aceptar</span>.
            </p>
            <div className='mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg '>
              Formatos admitidos: JPG, JPEG y PNG.
            </div>
          </div>
          <div className='upload_input_container p-6 rounded-xl shadow-lg flex-[0.6] flex flex-col items-center justify-center cursor-pointer min-h-[300px]'>
            <label
              htmlFor='image'
              className='flex flex-col items-center cursor-pointer'
            >
              <UploadCloud size={90} className='text-white' />
              <span className='text-white mt-2 text-xl'>Cargar tomografía</span>
            </label>
            <input type='file' id='image' accept='image/*' className='hidden' />
          </div>
        </div>

        {/* Observations Section */}
        <div className='bg-blue-200 p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-bold text-blue-700'>Observaciones</h3>
          <div className='grid grid-cols-2 gap-4 mt-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='flex items-center gap-2'>
                <label className='text-blue-700'>Categoría {index + 1}:</label>
                <input
                  type='text'
                  className='border border-blue-700 rounded-lg p-2 w-full'
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
