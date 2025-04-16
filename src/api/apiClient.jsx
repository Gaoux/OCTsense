import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for sending cookies in requests
});

// Interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from cookies
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Request a new access token using the refresh token
        const res = await axios.post(
          `${API_BASE_URL}/api/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        const newAccessToken = res.data.access;

        // Save the new access token in cookies
        Cookies.set('token', newAccessToken, { expires: 7 });

        // Update the original request's Authorization header with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest); // Retry the original request
      } catch (err) {
        console.error('Token refresh failed:', err);

        // Set a flag in localStorage to indicate session expiration
        window.localStorage.setItem('sessionExpired', 'true');

        alert('Your session has expired. Please log in again.');

        // Optionally redirect to login page
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
