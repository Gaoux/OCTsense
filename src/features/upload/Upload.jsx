import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { UploadCloud } from 'lucide-react';
import './styles.css';

const Upload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

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
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPredictionResult(response.data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
    navigate('/analysis', { 
      state: { 
        imageFile: imageFile, 
        predictionResult: predictionResult
      } 
    });
  };

  return (
    <div className='layout-container'>
      <div className='p-6 w-full max-w-4xl flex flex-col gap-6'>
        {/* Upload Instructions */}
        <div className='bg-white p-6 rounded-xl shadow-lg'>
          <p className='text-gray-700'>
            Para subir la tomografía de un paciente, haga clic en{' '}
            <span className='text-red-500 font-bold'>Cargar tomografía</span>,
            seleccione la imagen y pulse{' '}
            <span className='text-blue-500 font-bold'>Aceptar</span>.
          </p>
          <div className='mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg'>
            Formatos admitidos: JPG, JPEG y PNG.
          </div>
        </div>

        {/* Upload Section with Background */}
        <div className='bg-gray-100 p-6 rounded-xl shadow-lg flex flex-col items-center gap-4'>
          {/* Upload Button */}
          <button
            onClick={() => document.getElementById('image').click()}
            className='bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg shadow-md cursor-pointer hover:bg-white hover:text-blue-500 transition-colors'
          >
            Cargar tomografía
          </button>

          {/* Drag & Drop Area */}
          <div
            className={`upload_input_container flex flex-col items-center justify-center p-6 rounded-xl shadow-lg cursor-pointer transition-all
            ${
              isDragging
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-300 bg-gray-50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('image').click()}
          >
            <UploadCloud size={50} className='text-gray-500' />
            <span className='mt-2 text-gray-700 font-bold'>
              {imageFile
                ? imageFile.name
                : 'Arrastra y suelta aquí o haz clic para seleccionar'}
            </span>
            <input
              type='file'
              id='image'
              accept='image/*'
              className='hidden'
              onChange={handleFileChange}
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleSubmit}
            className='bg-red-400 border border-red-400 text-white py-2 px-4 rounded-lg shadow-md cursor-pointer hover:bg-white hover:text-red-400 transition-colors'
          >
            Analizar Imagen
          </button>

          {/* Error Message */}
          {error && <p className='text-red-400'>{error}</p>}
        </div>

        {/* Prediction Result */}
        {predictionResult && (
          <div className='bg-green-100 p-4 rounded-lg text-green-700'>
            <h3 className='font-bold'>Resultado:</h3>
            <p>{predictionResult}</p>
          </div>
        )}

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
