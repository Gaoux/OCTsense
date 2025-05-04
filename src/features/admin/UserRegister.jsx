import React, { useState } from 'react';
import { registerUser } from '../../api/dashboardService'; // Importa el servicio

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '', // Campo para la contraseña
    sendEmail: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit ejecutado'); // Depuración
  
    try {
      console.log('Datos enviados al backend:', formData); // Depuración
      const response = await registerUser(formData); // Llama al servicio
      alert(response.message || 'Usuario registrado exitosamente'); // Notificación de éxito
      setFormData({
        name: '',
        email: '',
        role: '',
        password: '',
        sendEmail: true,
      });
    } catch (error) {
      console.error('Error al registrar el usuario:', error.response?.data || error.message); // Depuración
      alert('Error al registrar el usuario. Verifica los datos e intenta nuevamente.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen relative overflow-hidden">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Título */}
        <h2 className="text-4xl font-bold text-blue-800 mb-6 text-center">Registrar Usuario</h2>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Campo de nombre */}
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

            {/* Campo de correo */}
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

          {/* Campo de contraseña */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              className="w-full p-2 rounded border"
              placeholder="Contraseña"
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo de rol */}
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
              <option value="admin">Administrador</option>
              <option value="normal">Usuario</option>
              <option value="professional">Profesional</option>
            </select>
          </div>

          {/* Checkbox para enviar correo */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="sendEmail"
              checked={formData.sendEmail}
              className="mr-2"
              onChange={handleChange}
            />
            <label className="text-sm text-gray-700">
              Enviar notificación al correo Electrónico.
            </label>
          </div>

          {/* Botón de enviar */}
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