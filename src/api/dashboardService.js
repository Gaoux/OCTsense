import apiClient from './apiClient';
import Cookies from 'js-cookie';

export const getAdminStats = async () => {
    try {
        const token = Cookies.get('token');

        const response = await apiClient.get('/api/users/admin/dashboard-stats/', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error obtaining admin dashboard stats: ', error);
        throw error;
    }
};

export const getRecentUsers = async () => {
    try {
        const token = Cookies.get('token');

        // TODO
        const response = await apiClient.get('/api/users/admin/recent-users/', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error obtaining recent users: ', error);
        throw error;
    }
}
export const getKPIs = async () => {
    try {
        const token = Cookies.get('token');

        const response = await apiClient.get('/api/users/kpis/admin/kpis/', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error obtaining KPIs: ', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const token = Cookies.get('token');

        const response = await apiClient.delete(`/api/users/users/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error deleting user: ', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
      console.log('Datos enviados al backend:', userData); // Depuración
      const response = await apiClient.post('/api/users/register/', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Respuesta del backend:', response.data); // Depuración
      return response.data;
    } catch (error) {
      console.error('Error registrando usuario:', error.response?.data || error.message); // Depuración
      throw error;
    }
  };

export const getReports = async () => {
  try {
    const response = await apiClient.get('/api/reports/'); // Endpoint para obtener todos los reportes
    return response.data; // Devuelve los datos de los reportes
  } catch (error) {
    console.error('Error al obtener los reportes:', error);
    throw error;
  }
};

