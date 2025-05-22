import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/apiClient';

const EditUser = () => {
  const { id } = useParams(); // Obtiene el ID del usuario desde la URL
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roles = ['admin', 'professional', 'patient']; // Lista de roles disponibles

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError('Error al cargar los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/users/users/${id}/`, user);
      alert('Usuario actualizado correctamente.');
      navigate('/usuarios'); // Redirige a la lista de usuarios
    } catch (err) {
      setError('Error al actualizar el usuario.');
    }
  };

  if (loading) return <p>Cargando datos del usuario...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-blue-800 mb-6">Editar Usuario</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Selecciona un rol
              </option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitaliza el rol */}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;