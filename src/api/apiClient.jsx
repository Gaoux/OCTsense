import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration (refresh token)
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 (Unauthorized) due to token expiration, try to refresh the token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Send a request to the backend to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${API_BASE_URL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem('jwt_token', newAccessToken); // Store the new token

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // Retry the original request
      } catch (err) {
        // If refreshing the token fails, log the user out
        console.error('Token refresh failed:', err);
        // Optionally, clear the stored tokens and redirect to login
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token');
        // Redirect to login page or show a login modal
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
