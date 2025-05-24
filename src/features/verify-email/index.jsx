import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ROUTES } from '../../constants/routes';

function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verificando tu correo...');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      axios
        .get(`http://localhost:8000/api/users/verify-email?token=${token}`)
        .then(() => {
          setMessage('Tu correo fue verificado exitosamente.');
          setSuccess(true);
        })
        .catch(() => {
          setMessage(' El enlace es inválido o ya expiró.');
        });
    } else {
      setMessage(' No se encontró el token en el enlace.');
    }
  }, [location]);

  return (
    <div className='text-center mt-20'>
      <h2 className='text-xl font-semibold mb-4'>{message}</h2>
      {success && (
        <button
          onClick={() => navigate(ROUTES.LOGIN)}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Ir al login
        </button>
      )}
    </div>
  );
}

export default VerifyEmailPage;
