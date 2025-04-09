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
        predictionResult: predictionResult,
      },
    });
  };

  return (
    <div className='layout-container flex-col'>
      {/* Título principal y subtítulo */}
      <div className='w-full text-center mt-4 mb-10'>
        <h1 className='text-[50px] font-bold text-black mb-4'>
          Carga de imagen
        </h1>
        <p className='text-[20px] text-black opacity-50 max-w-3xl mx-auto'>
          Suba una tomografía.
        </p>
      </div>

      <div className='p-6 w-full max-w-6xl flex flex-col gap-0'>
        {/* Instrucciones */}
        {/* <div className=' p-6 rounded-xl '>
          <p className='text-gray-700'>
            Para subir la tomografía de un paciente, haga clic en{' '}
            <span className='text-red-500 font-bold'>Cargar tomografía</span>,
            seleccione la imagen y pulse{' '}
            <span className='text-blue-500 font-bold'>Aceptar</span>.
          </p>
        </div> */}

        {/* Sección de carga */}
        <div className='bg-white p-6 rounded-t-lg shadow-lg flex flex-col md:flex-row gap-6 border-[1px] border-gray-200'>
          {/* Columna izquierda */}
          <div className='flex flex-1 flex-col justify-center gap-4 md:mb-0 mb-5'>
            {/* Título y nombre del archivo centrados verticalmente */}
            <div className='flex flex-col items-center gap-3 md:mb-0 mb-20'>
              <h3 className='text-gray-700 font-semibold text-3xl text-center mt-4'>
                Suba la tomografía
              </h3>
              {imageFile && (
                <p className='text-gray-400 text-sm text-center break-words max-w-full px-4'>
                  {imageFile.name}
                </p>
              )}
            </div>

            {/* Botón subir imagen */}
            <div className='mt-auto'>
              <button
                onClick={() => document.getElementById('image')?.click()}
                className='w-full bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-sm cursor-pointer hover:border-gray-400 transition-all'
              >
                Cargar tomografía
              </button>
              <input
                type='file'
                id='image'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </div>

            {/* Botón analizar */}
            <button
              onClick={handleSubmit}
              className='w-full bg-blue-500 border border-blue-500 text-white py-2 px-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition-colors'
            >
              Analizar Imagen
            </button>

            {/* Error */}
            {error && <p className='text-red-400 text-center'>{error}</p>}
          </div>

          {/* Columna derecha: Drag & Drop + Vista previa */}
          <div
            className={`flex-[1.5] min-h-[10rem] md:h-96 flex items-center justify-center rounded-lg border transition-all 
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
                alt='Vista previa'
                className='max-h-full w-full object-contain rounded-lg'
              />
            ) : (
              <span className='text-gray-400 text-center px-4'>
                Arrastra la imagen aquí
              </span>
            )}
          </div>
        </div>
        <div className=' bg-gray-800 text-white py-2 px-4 rounded-b-lg border-1 border-gray-800'>
          Formatos admitidos: JPG, JPEG y PNG.
        </div>

        {/* Resultado del análisis
        {predictionResult && (
          <div className='bg-green-100 p-4 rounded-lg text-green-700'>
            <h3 className='font-bold'>Resultado:</h3>
            <p>{predictionResult}</p>
          </div>
        )}

        {/* Historial 
        <div className='bg-white p-6 rounded-xl shadow-lg'>
          <h3 className='text-gray-700 font-bold mb-2'>Análisis recientes</h3>
          <ul className='list-disc list-inside text-sm text-gray-600 space-y-1'>
            <li>Paciente #001 - 08/04/2025 - Resultado: Sin anomalías</li>
            <li>Paciente #002 - 07/04/2025 - Resultado: Sospecha de edema</li>
            <li>Paciente #003 - 06/04/2025 - Resultado: Patología detectada</li>
          </ul>
        </div>{' '}
        */}
      </div>
    </div>
  );
};

export default Upload;
