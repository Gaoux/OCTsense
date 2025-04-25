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

        const response = await apiClient.get('/api/admin/kpis/', {
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