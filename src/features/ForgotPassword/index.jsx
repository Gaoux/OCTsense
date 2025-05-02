import { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/users/forgot-password/', { email });
      setMessage(response.data.message);
    } catch (error) {
      if (error.response?.data?.error) {
        setMessage(error.response.data.error); // ← Esto puede ser "Correo no encontrado" o "Correo no verificado"
      } else {
        setMessage("Ocurrió un error inesperado.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Olvidé mi contraseña</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <input
          type="email"
          placeholder="Correo electrónico"
          className="border w-full p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" type="submit">
          Enviar correo
        </button>
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
