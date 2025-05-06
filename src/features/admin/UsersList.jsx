import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../api/userService.jsx';
import { deleteUser } from '../../api/dashboardService.js';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const users = await getUsers(role === 'Todos' ? null : role, searchQuery);
      setLoading(false);
      setUsers(users);
    };
    fetchUsers();
  }, [role, searchQuery]);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      '¿Estás seguro de que deseas eliminar este usuario?'
    );
    if (confirm) {
      try {
        await deleteUser(id); // Llama al servicio para eliminar el usuario
        setUsers(users.filter((user) => user.id !== id)); // Actualiza la lista de usuarios
        alert('Usuario eliminado correctamente.');
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        alert('No se pudo eliminar el usuario.');
      }
    }
  };

  return (
    <div className='bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen relative overflow-hidden'>
      {/* Contenido principal */}
      <div className='max-w-7xl mx-auto px-6 py-20 relative z-10'>
        {/* Título */}
        <h2 className='text-4xl font-bold text-blue-800 mb-6'>
          Lista de Usuarios
        </h2>

        {/* Filtros y búsqueda */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <label className='text-gray-700 font-semibold mr-2'>Filtro:</label>
            <select
              className='p-2 rounded border'
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value='Todos'>Todos</option>
              <option value='patient'>Paciente</option>
              <option value='professional'>Profesional</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          <div className='relative'>
            <input
              type='text'
              placeholder='Buscar por nombre o correo...'
              className='pl-10 pr-4 py-2 rounded-md w-64 border'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className='w-4 h-4 absolute left-3 top-3 text-gray-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className='bg-white rounded-2xl shadow-lg p-6'>
          <table className='w-full'>
            <thead>
              <tr>
                <th className='text-left py-3 text-gray-600'>Nombre</th>
                <th className='text-left py-3 text-gray-600'>Correo</th>
                <th className='text-left py-3 text-gray-600'>Rol</th>
                <th className='text-left py-3 text-gray-600'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='4' className='py-10 text-center'>
                    <div className='flex justify-center items-center'>
                      <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500'></div>
                    </div>
                  </td>
                </tr>
              ) : users.length !== 0 ? (
                <>
                  {users.map((user) => (
                    <tr key={user.id} className='border-b border-gray-300'>
                      <td className='py-3 flex items-center'>
                        <img
                          src={`/avatars/${user.gender || 'default'}.png`}
                          alt={user.name}
                          className='h-8 w-8 rounded-full mr-2'
                        />
                        {user.name}
                      </td>
                      <td className='py-3'>{user.email}</td>
                      <td className='py-3'>{user.role}</td>
                      <td className='py-3 flex gap-4'>
                        {/* Botón de editar */}
                        <Link
                          to={`/editar-usuario/${user.id}`}
                          className='text-blue-500 hover:text-blue-700'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6 inline-block'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M15.232 5.232l3.536 3.536M9 11l6.536-6.536a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-.828.536l-3 1a1 1 0 01-1.264-1.264l1-3a2 2 0 01.536-.828z'
                            />
                          </svg>
                        </Link>

                        {/* Botón de eliminar */}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6 inline-block'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d="M9 3h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7H5a1 1 0 110-2h3V4a1 1 0 011-1zm1 4a1 1 0 00-1 1v9a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v9a1 1 0 002 0V8a1 1 0 00-1-1z" 
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td className='py-3 text-center text-gray-500' colSpan='4'>
                    No usuarios encontrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;