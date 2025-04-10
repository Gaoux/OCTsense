import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Handle token expiration (refresh token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_BASE_URL}/api/token/refresh/`,
          {},
          { withCredentials: true }
        );

        return apiClient(originalRequest); // Retry original request
      } catch (err) {
        console.error('Token refresh failed:', err);
        // Optionally redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
