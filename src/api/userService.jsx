import apiClient from './apiClient';

export const loginUser = async (username, password) => {
  const response = await apiClient.post('/api/users/login/', {
    username,
    password,
  });

  const { access, refresh, user } = response.data;

  // Save tokens in localStorage
  localStorage.setItem('jwt_token', access);
  if (refresh) {
    localStorage.setItem('refresh_token', refresh); // Optional if using refresh token flow
  }

  return { user };
};

export const registerUser = async (form) => {
  const response = await apiClient.post('/api/users/register/', {
    username: form.username,
    email: form.email,
    password: form.password,
    name: form.name,
    role: form.role,
  });

  return response.data;
};
