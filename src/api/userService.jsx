import apiClient from './apiClient';

export const loginUser = async (email, password) => {
  const response = await apiClient.post(
    '/api/users/login/',
    { email, password },
    { withCredentials: true }
  );

  const { user, access, refresh } = response.data;

  return { user, accessToken: access, refreshToken: refresh };
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
