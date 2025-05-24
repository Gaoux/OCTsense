import apiClient from './apiClient';
import Cookies from 'js-cookie';

export const loginUser = async (email, password) => {
  const response = await apiClient.post('/api/users/login/', {
    email,
    password,
  });

  const { user, access, refresh } = response.data;

  return { user, accessToken: access, refreshToken: refresh };
};

export const registerUser = async (form) => {
  const response = await apiClient.post('/api/users/register/', {
    email: form.email,
    password: form.password,
    name: form.name,
    role: form.role,
  });

  return response.data;
};

export const updateUser = async (userData) => {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log(userData);
    const response = await apiClient.patch('/api/users/profile/', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const adminUpdateUser = async (id, userData) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No authentication token found');

    const response = await apiClient.patch(
      `/api/users/admin/users/${id}/update/`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getUsers = async (role = null, search = '') => {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    // TODO: Dejar solo /api/users/
    const response = await apiClient.get(`/api/users/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        role,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No authentication token found');

    const response = await apiClient.get(`/api/users/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};
