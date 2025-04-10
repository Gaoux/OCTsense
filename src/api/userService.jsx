import apiClient from './apiClient';

export const loginUser = async (username, password) => {
  const response = await apiClient.post(
    '/api/users/login/',
    { username, password },
    { withCredentials: true }
  );

  const { user } = response.data;

  return { user };
};

export const registerUser = async (form) => {
  const response = await apiClient.post(
    '/api/users/register/',
    {
      username: form.username,
      email: form.email,
      password: form.password,
      name: form.name,
      role: form.role,
    },
    { withCredentials: true }
  );

  return response.data;
};
