import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';

jest.mock('axios');
jest.mock('../../api/apiClient');

import { AuthProvider, useAuth } from '../../context/AuthContext';
import {
  mockApi,
  mockCookies,
  restoreMocks,
} from '../utils/auth.integration.utils';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { ROUTES } from '../../constants/routes';

// Componente de prueba para exponer el contexto
const AuthTestComponent = () => {
  const { login, logout, user, isAuthenticated, validateEmail } = useAuth();
  return (
    <div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
      <span data-testid='auth-status'>
        {isAuthenticated ? 'Autenticado' : 'No autenticado'}
      </span>
      <span data-testid='user-email'>{user ? user.email : ''}</span>
      <span data-testid='email-valid'>
        {validateEmail('test@example.com') ? 'válido' : 'inválido'}
      </span>
    </div>
  );
};

describe('Integración AuthContext', () => {
  afterEach(() => {
    restoreMocks();
  });

  it('valida el correo correctamente', () => {
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('email-valid')).toHaveTextContent('válido');
  });

  it('login exitoso actualiza estado y cookies', async () => {
    mockApi({
      mockLoginUser: async (email, password) => ({
        user: { email, name: 'Test', id: '1', role: 'admin' },
        accessToken: 'token123',
        refreshToken: 'refresh123',
      }),
    });
    mockCookies({});
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Autenticado'
      );
      expect(screen.getByTestId('user-email')).toHaveTextContent(
        'test@example.com'
      );
    });
  });

  it('login con error no autentica', async () => {
    // Mock del login con error
    mockApi({
      mockLoginUser: async () => {
        throw new Error('Credenciales inválidas');
      },
    });

    // Simular cookies vacías
    mockCookies({});

    // Componente de prueba con manejo explícito de error (para asegurar flujo controlado)
    const TestLoginFail = () => {
      const { login, isAuthenticated, user } = useAuth();

      const handleLogin = async () => {
        try {
          await login('test@example.com', 'wrongpassword');
        } catch (error) {
          // El error ya es manejado internamente, así que esto es seguro.
        }
      };

      return (
        <div>
          <button onClick={handleLogin}>Login</button>
          <span data-testid='auth-status'>
            {isAuthenticated ? 'Autenticado' : 'No autenticado'}
          </span>
          <span data-testid='user-email'>{user ? user.email : ''}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestLoginFail />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'No autenticado'
      );
      expect(screen.getByTestId('user-email')).toHaveTextContent('');
    });
  });

  it('logout limpia usuario y cookies', async () => {
    mockApi({
      mockLoginUser: async (email, password) => ({
        user: { email, name: 'Test', id: '1', role: 'admin' },
        accessToken: 'token123',
        refreshToken: 'refresh123',
      }),
    });
    mockCookies({
      user: JSON.stringify({
        email: 'test@example.com',
        name: 'Test',
        id: '1',
        role: 'admin',
      }),
    });
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Autenticado'
      );
    });
    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'No autenticado'
      );
      expect(screen.getByTestId('user-email')).toHaveTextContent('');
    });
  });

  it('registro exitoso llama a la API y no lanza error', async () => {
    const registerMock = jest.fn(async () => ({}));
    mockApi({ mockRegisterUser: registerMock });
    mockCookies({});
    const TestRegister = () => {
      const { register } = useAuth();
      return (
        <button
          onClick={() =>
            register({
              email: 'nuevo@ejemplo.com',
              password: 'Password1',
              name: 'Nuevo',
              role: 'patient',
            })
          }
        >
          Registrar
        </button>
      );
    };
    render(
      <AuthProvider>
        <TestRegister />
      </AuthProvider>
    );
    fireEvent.click(screen.getByText('Registrar'));
    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        email: 'nuevo@ejemplo.com',
        password: 'Password1',
        name: 'Nuevo',
        role: 'patient',
      });
    });
  });

  it('actualización de usuario actualiza el estado', async () => {
    mockApi({
      mockUpdateUser: async (data) => ({
        ...data,
        id: '1',
        email: 'test@example.com',
        name: 'Actualizado',
        role: 'admin',
      }),
      mockLoginUser: async (email, password) => ({
        user: { email, name: 'Test', id: '1', role: 'admin' },
        accessToken: 'token123',
        refreshToken: 'refresh123',
      }),
    });
    mockCookies({
      user: JSON.stringify({
        email: 'test@example.com',
        name: 'Test',
        id: '1',
        role: 'admin',
      }),
      token: 'token123',
    });
    const TestUpdate = () => {
      const { login, updateUser, user } = useAuth();
      return (
        <div>
          <button onClick={() => login('test@example.com', 'password')}>
            Login
          </button>
          <button onClick={() => updateUser({ name: 'Actualizado' })}>
            Actualizar
          </button>
          <span data-testid='user-name'>{user ? user.name : ''}</span>
        </div>
      );
    };
    render(
      <AuthProvider>
        <TestUpdate />
      </AuthProvider>
    );
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test');
    });
    fireEvent.click(screen.getByText('Actualizar'));
    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Actualizado');
    });
  });

  it('validaciones de roles funcionan correctamente', async () => {
    mockApi({
      mockLoginUser: async (email, password) => ({
        user: { email, name: 'Test', id: '1', role: 'professional' },
        accessToken: 'token123',
        refreshToken: 'refresh123',
      }),
    });
    mockCookies({});
    const TestRoles = () => {
      const { login, isPatient, isOftalmologo, isAdmin } = useAuth();
      return (
        <div>
          <button onClick={() => login('test@example.com', 'password')}>
            Login
          </button>
          <span data-testid='is-patient'>{isPatient() ? 'sí' : 'no'}</span>
          <span data-testid='is-oftalmologo'>
            {isOftalmologo() ? 'sí' : 'no'}
          </span>
          <span data-testid='is-admin'>{isAdmin() ? 'sí' : 'no'}</span>
        </div>
      );
    };
    render(
      <AuthProvider>
        <TestRoles />
      </AuthProvider>
    );
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('is-patient')).toHaveTextContent('no');
      expect(screen.getByTestId('is-oftalmologo')).toHaveTextContent('sí');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('no');
    });
  });

  describe('Flujos de recuperación y verificación', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('recuperación de contraseña muestra mensaje de éxito', async () => {
      axios.post.mockResolvedValue({ data: { message: 'Correo enviado' } });
      const ForgotPassword = require('../../features/ForgotPassword').default;
      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
        target: { value: 'test@correo.com' },
      });
      fireEvent.click(screen.getByText('Enviar correo'));

      await waitFor(() => {
        expect(screen.getByText('Correo enviado')).toBeInTheDocument();
      });
    });

    it('reset de contraseña exitoso redirige y muestra mensaje', async () => {
      jest.useFakeTimers();

      const navigate = jest.fn();
      jest
        .spyOn(require('react-router-dom'), 'useNavigate')
        .mockReturnValue(navigate);
      jest
        .spyOn(require('react-router-dom'), 'useSearchParams')
        .mockReturnValue([{ get: () => 'token123' }]);
      axios.post.mockResolvedValue({
        data: { message: 'Contraseña cambiada' },
      });

      const ResetPassword = require('../../features/ResetPassword').default;

      render(
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('Nueva contraseña'), {
        target: { value: 'NuevaPass1' },
      });

      fireEvent.click(screen.getByText('Restablecer'));

      await waitFor(() => {
        expect(screen.getByText('Contraseña cambiada')).toBeInTheDocument();
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(navigate).toHaveBeenCalledWith(ROUTES.LOGIN);

      jest.useRealTimers(); // limpia
    });

    it('verificación de email exitosa muestra mensaje', async () => {
      axios.get.mockResolvedValueOnce({});
      const VerifyEmailPage = require('../../features/verify-email').default;
      jest
        .spyOn(require('react-router-dom'), 'useLocation')
        .mockReturnValue({ search: '?token=abc' });
      const navigate = jest.fn();
      jest
        .spyOn(require('react-router-dom'), 'useNavigate')
        .mockReturnValue(navigate);
      render(<VerifyEmailPage />);
      await waitFor(() => {
        expect(
          screen.getByText('Tu correo fue verificado exitosamente.')
        ).toBeInTheDocument();
      });
    });
  });
});
