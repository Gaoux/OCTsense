import React, { useState } from 'react';
import { registerUser } from '../../api/dashboardService'; // Importa el servicio
const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    sendEmail: true,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData); // Llama al servicio
      setSuccessMessage(response.message || 'Usuario registrado exitosamente');
      setErrorMessage('');
      setFormData({
        name: '',
        email: '',
        role: '',
        sendEmail: true,
      });
    } catch (error) {
      setErrorMessage('Error al registrar el usuario. Verifica los datos e intenta nuevamente.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen relative overflow-hidden">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Título */}
        <h2 className="text-4xl font-bold text-blue-800 mb-6">Registrar Usuario</h2>

        {/* Mensajes de éxito o error */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                className="w-full p-2 rounded border"
                placeholder="Nombre completo"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Correo</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full p-2 rounded border"
                placeholder="correo@ejemplo.com"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rol</label>
            <select
              name="role"
              value={formData.role}
              className="w-full p-2 rounded border"
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar rol</option>
              <option value="Admin">Administrador</option>
              <option value="Normal">Usuario</option>
              <option value="Profesional">Profesional</option>
            </select>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700">
              Se enviará un correo al usuario para asignar una contraseña.
            </p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;