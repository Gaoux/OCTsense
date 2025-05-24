import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../api/userService.jsx';
import { deleteUser } from '../../api/dashboardService.js';
import ConfirmDeleteModal from '../../components/ui/confirmDeleteModal';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const users = await getUsers(role === 'Todos' ? null : role, searchQuery);
      setLoading(false);
      setUsers(users);
    };
    fetchUsers();
  }, [role, searchQuery]);

  const openDeleteModal = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;
    try {
      await deleteUser(selectedUserId);
      setUsers(users.filter((user) => user.id !== selectedUserId));
      setShowDeleteModal(false);
      setSelectedUserId(null);
      alert('Usuario eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('No se pudo eliminar el usuario.');
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
                      <td className='py-3 flex items-center'>{user.name}</td>
                      <td className='py-3'>{user.email}</td>
                      <td className='py-3'>{user.role}</td>
                      <td className='py-3 flex gap-4'>
                        {/* Botón de editar */}
                        <Link
                          to={`/editar-usuario/${user.id}`}
                          className='text-blue-500 hover:text-blue-700'
                        >
                          <Pencil className='h-5 w-5 inline-block' />
                        </Link>

                        {/* Botón de eliminar */}
                        <button
                          onClick={() => openDeleteModal(user.id)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <Trash2 className='h-5 w-5 inline-block' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td className='py-3 text-center text-gray-500' colSpan='3'>
                    No usuarios encontrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={t('user.name')}
      />
    </div>
  );
};

export default UsersList;
