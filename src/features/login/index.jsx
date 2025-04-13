import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(t('login.error'));
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-150'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-4xl font-extrabold text-center text-cyan-700 mb-2 tracking-wide'>
          {t('login.title').slice(0, 3)}
          <span className='text-emerald-500'>{t('login.title').slice(3)}</span>
        </h2>
        <p className='text-center text-gray-500 text-sm'>
          {t('login.subtitle')}
        </p>
        {error && <p className='text-sm text-red-600'>{error}</p>}
        <div className='space-y-4'>
          <input
            type='text'
            placeholder={t('login.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <input
            type='password'
            placeholder={t('login.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <div className='flex justify-between items-center'>
            <div></div>
            <Link
              to='/register'
              className='text-sm text-cyan-600 hover:underline'
            >
              {t('login.noAccount')}
            </Link>
          </div>
          <button
            onClick={handleLogin}
            className='w-full px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition'
          >
            {t('login.loginButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
