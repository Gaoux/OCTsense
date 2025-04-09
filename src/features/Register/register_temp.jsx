import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const requiredFields = ['username', 'email', 'name', 'profession', 'password', 'confirmPassword'];
    const hasEmpty = requiredFields.some(field => !form[field]);
    if (hasEmpty) {
      setError('Por favor completa todos los campos');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[form.username]) {
      setError('El nombre de usuario ya está registrado');
      return;
    }

    users[form.username] = { ...form };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuario registrado exitosamente');
    navigate('/');
  };

  return (
    <AuthLayout>
      <h2 className="title">OCTsense</h2>
      {error && <p className="error-text">{error}</p>}
      <input name="username" className="input" placeholder="Usuario deseado" onChange={handleChange} />
      <input name="email" className="input" placeholder="Correo" onChange={handleChange} />
      <input name="name" className="input" placeholder="Nombre" onChange={handleChange} />
      <div className="select-wrapper">
        <select name="profession" className="input select" onChange={handleChange}>
          <option value="">Selecciona tu profesión</option>
          <option value="paciente">Paciente</option>
          <option value="oftalmologo">Oftalmólogo</option>
          <option value="otro">Otro</option>
        </select>
        <span className="select-icon">▼</span>
      </div>
      <input name="password" className="input" type="password" placeholder="Contraseña" onChange={handleChange} />
      <input name="confirmPassword" className="input" type="password" placeholder="Repite contraseña" onChange={handleChange} />
      <button className="button" onClick={handleSubmit}>Únete</button>
      <p className="text">¿Ya tienes cuenta? <Link to="/" className="link">Login</Link></p>
    </AuthLayout>
  );
};

export default Register;