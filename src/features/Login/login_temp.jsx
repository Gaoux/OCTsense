import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../app/app';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('users')) || {};
      const foundUser = stored[username];

      if (foundUser && foundUser.password === password) {
        setUser(foundUser);
        navigate('/home');
      } else {
        setError('Credenciales inválidas');
      }
    } catch {
      setError('Error al leer los datos de usuario');
    }
  };

  return (
    <AuthLayout>
      <h2 className="title">OCTsense</h2>
      {error && <p className="error-text">{error}</p>}
      <input
        className="input"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="************"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="checkbox-container">
        <input type="checkbox" className="checkbox" />
        <span className="checkbox-label">
          Eres <span className="highlight">administrador</span>?
        </span>
      </div>
      <button className="button" onClick={handleLogin}>Iniciar Sesión</button>
      <button className="link-button">Olvidaste tu contraseña?</button>
      <p className="text">
        No tienes cuenta? <Link to="/register" className="link">Regístrate</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
