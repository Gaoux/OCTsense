import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../api/userService.jsx';
import { deleteUser } from '../../api/dashboardService.js';
import ConfirmDeleteModal from '../../components/ui/confirmDeleteModal';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, CircleCheck, Clock, UserPlus2 } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('Newest');
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
      alert(t('user.deletedSuccess'));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert(t('user.deleteError'));
    }
  };

  const filteredUsers = users
    .filter((user) => {
      if (verifiedFilter === 'true') return user.is_verified;
      if (verifiedFilter === 'false') return !user.is_verified;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date_joined);
      const dateB = new Date(b.date_joined);
      return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className='bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6 py-20 relative z-10'>
        <h2 className='text-4xl font-bold text-blue-800 mb-6'>
          {t('user.listTitle')}
        </h2>
        <div className='flex justify-end mb-4'>
          <Link
            to={ROUTES.ADMIN_USER_CREATE}
            className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition duration-200'
          >
            <UserPlus2 className='inline-block mr-2 w-4 h-4' />
            {t('user.addUser')}
          </Link>
        </div>

        <div className='w-full mb-6 bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='relative w-full md:w-1/2'>
            <input
              type='text'
              placeholder={t('user.searchPlaceholder')}
              className='w-full border border-gray-300 text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className='absolute left-3 top-2.5 w-4 h-4 text-gray-400'
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

          <select
            className='w-full md:w-1/4 border border-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value='Todos'>{t('user.allRoles')}</option>
            <option value='patient'>{t('user.roles.patient')}</option>
            <option value='professional'>{t('user.roles.professional')}</option>
            <option value='admin'>{t('user.roles.admin')}</option>
          </select>

          <select
            className='w-full md:w-1/4 border border-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
          >
            <option value='Todos'>{t('user.allVerification')}</option>
            <option value='true'>{t('user.verified')}</option>
            <option value='false'>{t('user.unverified')}</option>
          </select>

          <select
            className='w-full md:w-1/4 border border-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value='Newest'>{t('user.sortNewest')}</option>
            <option value='Oldest'>{t('user.sortOldest')}</option>
          </select>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='divide-y divide-gray-200'>
            <div className='px-6 py-4 hidden md:flex text-sm text-gray-500 font-semibold'>
              <div className='w-1/5'>{t('user.name')}</div>
              <div className='w-1/5'>{t('user.email')}</div>
              <div className='w-1/5'>{t('user.role')}</div>
              <div className='w-1/5'>{t('user.verified')}</div>
              <div className='w-1/5 text-right'>{t('user.actions')}</div>
            </div>
            {loading ? (
              <div className='text-center p-10'>{t('user.loading')}</div>
            ) : filteredUsers.length === 0 ? (
              <div className='text-center p-10 text-gray-500'>
                {t('user.noResults')}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <details key={user.id} className='group cursor-pointer'>
                  <summary className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 p-4 md:px-6 hover:bg-gray-50'>
                    <div className='flex items-center gap-3 w-1/5'>
                      <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center'>
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className='font-medium'>{user.name}</div>
                    </div>
                    <div className='w-1/5 text-sm text-gray-700'>
                      {user.email}
                    </div>
                    <div className='w-1/5'>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          user.role === 'patient'
                            ? 'bg-yellow-50 text-yellow-500'
                            : user.role === 'admin'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {t(`user.roles.${user.role}`)}
                      </span>
                    </div>
                    <div className='w-1/5 flex items-center'>
                      {user.is_verified ? (
                        <span className='flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 font-medium rounded-full'>
                          <CircleCheck className='w-4 h-4' />
                          {t('user.verified')}
                        </span>
                      ) : (
                        <span className='flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-50 text-gray-700'>
                          <Clock className='w-4 h-4' />
                          {t('user.unverified')}
                        </span>
                      )}
                    </div>
                    <div className='w-1/5 flex justify-end gap-2'>
                      <Link
                        to={`${ROUTES.ADMIN_USER_EDIT(user.id)}`}
                        className='text-blue-600 hover:text-blue-800'
                      >
                        <Pencil className='w-4 h-4' />
                      </Link>
                      <button
                        className='text-red-600 hover:text-red-800'
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(user.id);
                        }}
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </summary>
                  <div className='bg-gray-50 p-4 md:px-6 text-sm text-gray-700 space-y-2'>
                    <div>
                      <strong>{t('user.loginCount')}:</strong>{' '}
                      {user.login_count}
                    </div>
                    <div>
                      <strong>{t('user.joined')}:</strong>{' '}
                      {new Date(user.date_joined).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>{t('user.lastLogin')}:</strong>{' '}
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : t('user.never')}
                    </div>
                  </div>
                </details>
              ))
            )}
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={t('user.user')}
      />
    </div>
  );
};

export default UsersList;
