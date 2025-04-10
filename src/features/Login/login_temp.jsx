import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../app/app';
import { loginUser } from '../../api/userService';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const { user } = await loginUser(username, password);
      setUser(user);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-150'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-4xl font-extrabold text-center text-cyan-700 mb-2 tracking-wide'>
          OCT<span className='text-emerald-500'>sense</span>
        </h2>
        <p className='text-center text-gray-500 text-sm'>
          Inicia sesión con tu cuenta
        </p>
        {error && <p className='text-sm text-red-600'>{error}</p>}
        <div className='space-y-4'>
          <input
            type='text'
            placeholder='Usuario'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <input
            type='password'
            placeholder='Contraseña'
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
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
          <button
            onClick={handleLogin}
            className='w-full px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition'
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
