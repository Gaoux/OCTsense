import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, validateEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError(t('login.emptyFields'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('login.invalidEmail'));
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.is_admin) {
        navigate('/admin-dashboard'); // futuro
      } else {
        navigate('/'); // landing page para paciente y oftalmólogo
      }
    } catch (err) {
      const backendError = err?.response?.data?.error;
      if (backendError === 'Debes confirmar tu correo antes de iniciar sesión.') {
        setError("Tu correo aún no ha sido verificado. Revisa tu bandeja de entrada.");
      } else {
        setError(t('login.error'));
      }
      console.error(err);
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-150'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-4xl font-extrabold text-center text-secondary mb-2 tracking-wide'>
          {t('login.title').slice(0, 3)}
          <span className='text-primary'>{t('login.title').slice(3)}</span>
        </h2>

        <p className='text-center text-gray-500 text-sm'>
          {t('login.subtitle')}
        </p>
        {error && <p className='text-sm text-accent'>{error}</p>}
        <div className='space-y-4'>
          <input
            type='text'
            placeholder={t('login.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-100'
          />
          <input
            type='password'
            placeholder={t('login.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-100'
          />

          <div className='flex justify-end items-center gap-2 text-sm'>
            {/* {t('login.forgotPassword')}{' '} */}
            <Link
              to='/forgot-password'
              className='text-primary underline hover:text-dark-primary'
            >
              {t('login.forgotPassword')}
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className={`w-full  px-4 py-2 text-white bg-secondary rounded-md
                ${
                  loading
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-dark-secondary transition'
                }`}
            disabled={loading}
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
                {t('login.loading')}
              </div>
            ) : (
              t('login.loginButton')
            )}
          </button>

          <hr className='my-4 border-t border-gray-300' />

          <p className='text-center text-sm'>
            {t('register.alreadyHaveAccount')}{' '}
            <Link
              to='/register'
              className='text-primary underline hover:text-dark-primary'
            >
              {t('login.registerLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
