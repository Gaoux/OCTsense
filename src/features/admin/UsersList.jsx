import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'Juan Mendez', profession: 'Profesional', email: 'JuanM@gmail.com', gender: 'male' },
    { id: '2', name: 'Laura Mojica', profession: 'Normal', email: 'LauM@gmail.com', gender: 'female' },
    { id: '3', name: 'Juan Perez', profession: 'Normal', email: 'Juanp@gmail.com', gender: 'male' },
    { id: '4', name: 'Gloria Villegas', profession: 'Normal', email: 'GV@gmail.com', gender: 'female' },
    { id: '5', name: 'Juan Caseres', profession: 'Admin', email: 'JuanC@gmail.com', gender: 'male' },
    { id: '6', name: 'Penelope Gomez', profession: 'Profesional', email: 'peloG@gmail.com', gender: 'female' },
    { id: '7', name: 'Diego Leal', profession: 'Profesional', email: 'DiegoL@gmail.com', gender: 'male' },
    { id: '8', name: 'Omaira Caicedo', profession: 'Normal', email: 'OmaC@gmail.com', gender: 'female' },
    { id: '9', name: 'Omar Perez', profession: 'Normal', email: 'Omar10@gmail.com', gender: 'male' }
  ]);
  
  const [filter, setFilter] = useState('Oftalmólogos');
  const [searchQuery, setSearchQuery] = useState('');

  // Load users from backend when component mounts
  useEffect(() => {
    // Replace with actual API call when connecting to backend
    // Example:
    // const fetchUsers = async () => {
    //   try {
    //     const response = await getUsers({ filter });
    //     setUsers(response.data);
    //   } catch (error) {
    //     console.error('Error fetching users:', error);
    //   }
    // };
    // fetchUsers();
  }, [filter]);

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen relative overflow-hidden">
      {/* Navbar */}
      <header className="py-2 bg-very-dark-secondary dark:bg-very-dark-secondary fixed top-0 left-0 right-0 z-50 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <img src="/microscope-icon.png" alt="OCTsense" className="h-8 mr-2" />
          <h1 className="text-white text-2xl font-bold">OCTsense</h1>
        </div>
        <nav className="flex space-x-4">
          <Link to="/" className="text-white hover:underline">Inicio</Link>
          <Link to="/usuarios" className="text-white hover:underline">Usuarios</Link>
          <Link to="/registrar" className="text-white hover:underline">Registrar</Link>
          <Link to="/editar" className="text-white hover:underline">Editar</Link>
          <Link to="/profile" className="text-white hover:underline">Perfil</Link>
        </nav>
      </header>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Título */}
        <h2 className="text-4xl font-bold text-blue-800 mb-6">Lista de Usuarios</h2>

        {/* Filtros y búsqueda */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="text-gray-700 font-semibold mr-2">Filtro:</label>
            <select
              className="p-2 rounded border"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="Oftalmólogos">Todos</option>
              <option value="Oftalmólogos">Usuario</option>
              <option value="Oftalmólogas">Profesional</option>
              <option value="Oftalmólogas">Admin</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              className="pl-10 pr-4 py-2 rounded-md w-64 border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-4 h-4 absolute left-3 top-3 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 text-gray-600">Nombre</th>
                <th className="text-left py-3 text-gray-600">Profesión</th>
                <th className="text-left py-3 text-gray-600">Correo</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <tr key={user.id} className="border-b border-gray-300">
                    <td className="py-3 flex items-center">
                      <img
                        src={`/avatars/${user.gender || 'default'}.png`}
                        alt={user.name}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      {user.name}
                    </td>
                    <td className="py-3">{user.profession}</td>
                    <td className="py-3">{user.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;