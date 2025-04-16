import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'Juan Mendez', profession: 'Oftalmólogo', email: 'JuanM@gmail.com', gender: 'male' },
    { id: '2', name: 'Laura Mojica', profession: 'Oftalmóloga', email: 'LauM@gmail.com', gender: 'female' },
    { id: '3', name: 'Juan Perez', profession: 'Oftalmólogo', email: 'Juanp@gmail.com', gender: 'male' },
    { id: '4', name: 'Gloria Villegas', profession: 'Oftalmóloga', email: 'GV@gmail.com', gender: 'female' },
    { id: '5', name: 'Juan Caseres', profession: 'Oftalmólogo', email: 'JuanC@gmail.com', gender: 'male' },
    { id: '6', name: 'Penelope Gomez', profession: 'Oftalmóloga', email: 'peloG@gmail.com', gender: 'female' },
    { id: '7', name: 'Diego Leal', profession: 'Oftalmólogo', email: 'DiegoL@gmail.com', gender: 'male' },
    { id: '8', name: 'Omaira Caicedo', profession: 'Oftalmóloga', email: 'OmaC@gmail.com', gender: 'female' },
    { id: '9', name: 'Omar Perez', profession: 'Oftalmólogo', email: 'Omar10@gmail.com', gender: 'male' }
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
    <div className="min-h-screen bg-sky-400">
      {/* Header */}
      <header className="bg-sky-500 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <img src="/microscope-icon.png" alt="OCTsense" className="h-6 mr-2" />
          <h1 className="text-white text-xl font-semibold">OCTsense</h1>
        </div>
        <nav className="flex space-x-4">
          <Link to="/" className="text-white">Inicio</Link>
          <Link to="/usuarios" className="text-white">Usuarios</Link>
          <Link to="/registrar" className="text-white">Registrar</Link>
          <Link to="/editar" className="text-white">Editar</Link>
          <Link to="/profile" className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto p-4">
        {/* Filter and Search */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="mr-2">Filtros:</span>
            <button className="bg-white rounded-full px-3 py-1 text-sm">
              {filter}
            </button>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Busca por nombre, correo..."
                className="pl-10 pr-4 py-2 rounded-md w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <button className="p-2 bg-white rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
            </button>
            <button className="p-2 bg-white rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-sky-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <button className="bg-red-400 p-1 rounded float-right">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3">Nombre</th>
                <th className="text-left py-3">Profesión</th>
                <th className="text-left py-3">Correo</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-sky-300">
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
