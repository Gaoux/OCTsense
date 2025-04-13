import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    const requiredFields = [
      'username',
      'email',
      'name',
      'role',
      'password',
      'confirmPassword',
    ];
    const hasEmpty = requiredFields.some((field) => !form[field]);
    if (hasEmpty) {
      setError(t('register.errors.emptyFields'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t('register.errors.passwordMismatch'));
      return;
    }

    if (!validateEmail(form.email)) {
      setError(t('register.errors.invalidEmail'));
      return;
    }

    // Password validation: at least 8 characters, one uppercase, and one number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError(t('register.errors.passwordRequirements'));
      return;
    }

    try {
      setLoading(true);
      await register(form);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(t('register.errors.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-150'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-4xl font-extrabold text-center text-cyan-700 mb-2 tracking-wide'>
          OCT<span className='text-emerald-500'>sense</span>
        </h2>
        <p className='text-center text-gray-500 text-sm'>
          {t('register.subtitle')}
        </p>
        {error && <p className='text-sm text-red-600'>{error}</p>}
        <div className='space-y-4'>
          <input
            type='text'
            name='username'
            placeholder={t('register.placeholders.username')}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <input
            type='email'
            name='email'
            placeholder={t('register.placeholders.email')}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <input
            type='text'
            name='name'
            placeholder={t('register.placeholders.fullName')}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <select
            name='role'
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring focus:ring-cyan-300'
          >
            <option value=''>{t('register.placeholders.selectRole')}</option>
            <option value='normal'>{t('register.roles.normal')}</option>
            <option value='professional'>
              {t('register.roles.professional')}
            </option>
          </select>
          <input
            type='password'
            name='password'
            placeholder={t('register.placeholders.password')}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <input
            type='password'
            name='confirmPassword'
            placeholder={t('register.placeholders.confirmPassword')}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className='flex items-center justify-center gap-2'>
                <svg
                  className='animate-spin h-5 w-5 text-white'
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
                    d='M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z'
                  ></path>
                </svg>
                {t('register.loading')}
              </div>
            ) : (
              t('register.button')
            )}
          </button>
          <p className='text-center text-sm'>
            {t('register.alreadyHaveAccount')}{' '}
            <Link to='/login' className='text-cyan-600 hover:underline'>
              {t('register.loginLink')}
            </Link>
          </p>
          <p className='text-center text-sm'>
            {t('register.forgotPassword')}{' '}
            <Link
              to='/reset-password'
              className='text-cyan-600 hover:underline'
            >
              {t('register.resetPasswordLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
