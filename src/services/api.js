// Filepath: src/services/api.js (Corrected)

import axios from 'axios';

// Create a new Axios instance with a predefined base URL.
// This is the only line that needs to be changed.
const api = axios.create({
  baseURL: 'https://task-manager-backend-rups.onrender.com/api',
});

// The interceptor will continue to work perfectly.
// It will attach the JWT token to every request sent to your live server.
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;