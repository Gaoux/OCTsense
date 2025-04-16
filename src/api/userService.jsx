import apiClient from './apiClient';

export const loginUser = async (email, password) => {
  const response = await apiClient.post(
    '/api/users/login/',
    { email, password },
    { withCredentials: true }
  );

  const { user, access } = response.data;

  return { user, token: access };
};

export const registerUser = async (form) => {
  const response = await apiClient.post(
    '/api/users/register/',
    {
      email: form.email,
      password: form.password,
      name: form.name,
      profession: form.role,
    },
    { withCredentials: true }
  );

  return response.data;
};