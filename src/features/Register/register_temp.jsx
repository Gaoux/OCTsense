import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const requiredFields = ['username', 'email', 'name', 'profession', 'password', 'confirmPassword'];
    const hasEmpty = requiredFields.some(field => !form[field]);
    if (hasEmpty) {
      setError('Por favor completa todos los campos');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/users/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
        name: form.name,
        profession: form.profession
      });
      navigate('/login');
    } catch (err) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-150">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-extrabold text-center text-cyan-700 mb-2 tracking-wide">
          OCT<span className="text-emerald-500">sense</span>
        </h2>
        <p className="text-center text-gray-500 text-sm">Crea una cuenta para empezar</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300"
          />
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300"
          />
          <select
            name="profession"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring focus:ring-cyan-300"
          >
            <option value="">Selecciona tu rol</option>
            <option value="paciente">Paciente</option>
            <option value="oftalmologo">Oftalmólogo</option>

          </select>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300"
          />
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition"
          >
            Registrarse
          </button>
          <p className="text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-cyan-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
