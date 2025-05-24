import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { getUserById, adminUpdateUser } from '../../api/userService';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    is_verified: false,
    role: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const roles = ['admin', 'professional', 'patient'];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        console.log(data);
        setUser({
          ...data,
          password: '',
        });
      } catch {
        setError(t('user.errorLoadUser'));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, t]);

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
      const payload = { ...user };
      if (!payload.password) delete payload.password;

      await adminUpdateUser(id, payload);
      navigate('/usuarios');
    } catch (error) {
      setError(t('user.errorUpdateUser'));
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <svg
          className='animate-spin h-10 w-10 text-blue-500'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className='bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 min-h-screen py-16 px-4 sm:px-6'>
      <div className='w-full max-w-4xl mx-auto'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl md:text-4xl font-bold text-blue-800 mb-2'>
            {t('user.editTitle')}
          </h2>
          <p className='text-blue-600 max-w-2xl mx-auto'>
            {t('user.editDescription')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100 space-y-6'
        >
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-semibold text-gray-700'
              >
                {t('user.fieldName')}
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={user.name}
                  onChange={handleChange}
                  className='w-full px-9 py-2 border rounded-lg'
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-semibold text-gray-700'
              >
                {t('user.fieldEmail')}
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={user.email}
                  onChange={handleChange}
                  className='w-full px-9 py-2 border rounded-lg'
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-semibold text-gray-700'
            >
              {t('user.fieldPassword')}
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                value={user.password}
                onChange={handleChange}
                className='w-full px-9 py-2 border rounded-lg pr-10'
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none'
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor='role'
              className='block text-sm font-semibold text-gray-700'
            >
              {t('user.fieldRole')}
            </label>
            <div className='relative'>
              <ShieldCheck className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
              <select
                id='role'
                name='role'
                value={user.role}
                onChange={handleChange}
                className='w-full px-9 py-2 border rounded-lg'
                required
              >
                <option value='' disabled>
                  {t('user.allRoles')}
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {t(`user.roles.${role}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor='is_verified'
              className='block text-sm font-semibold text-gray-700'
            >
              {t('user.fieldVerified')}
            </label>
            <div className='relative'>
              {user.is_verified ? (
                <CheckCircle className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
              ) : (
                <XCircle className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
              )}
              <select
                id='is_verified'
                name='is_verified'
                value={user.is_verified ? 'true' : 'false'}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    is_verified: e.target.value === 'true',
                  }))
                }
                className='w-full px-9 py-2 border rounded-lg'
              >
                <option value='true'>{t('user.verified')}</option>
                <option value='false'>{t('user.unverified')}</option>
              </select>
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              className='px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              {t('user.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
