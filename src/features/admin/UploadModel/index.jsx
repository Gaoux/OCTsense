import React, { useState } from 'react';
import { uploadModel } from '../../../api/octService'; 
const UploadModel = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!file) {
      setError('Por favor, selecciona un archivo .h5.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('model', file);

      const response = await uploadModel(formData); // Llama al servicio para cargar el modelo
      setMessage(response.message || 'Modelo cargado correctamente.');
    } catch (err) {
      setError('Error al cargar el archivo. Intenta nuevamente.');
    }
  };

return (
<div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen flex items-center justify-center">
  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
    <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">Cargar Modelo .h5</h1>
    
    {/* Recomendaciones antes de subir el modelo */}
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
      <h2 className="font-semibold mb-2">Reemplazo de modelo de IA</h2>
      <ul className="list-disc pl-5">
        <li>El archivo debe tener formato <strong>.h5</strong> (Keras HDF5).</li>
        <li>Debe aceptar imágenes de entrada con tamaño <strong>(299, 299, 3)</strong>.</li>
        <li>Su salida debe ser de <strong>4 clases</strong> con activación <strong>softmax</strong>.</li>
        <li>Debe estar entrenado con la función de pérdida <strong>categorical_crossentropy</strong>.</li>
        <li>Las clases deben seguir este orden exacto: <strong>["CNV", "DME", "DRUSEN", "NORMAL"]</strong>.</li>
      </ul>
      <p className="mt-2 text-red-600 font-semibold">
        ⚠️ Subir un modelo que no cumpla estas condiciones puede causar errores en el análisis y clasificación de imágenes.
      </p>
    </div>

    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".h5"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Cargar
      </button>
    </form>
    {message && <p className="mt-4 text-green-600">{message}</p>}
    {error && <p className="mt-4 text-red-600">{error}</p>}
  </div>
</div>
);
};

export default UploadModel;