// Filepath: src/services/authService.js

// Import the configured Axios instance from api.js
import api from './api';

const register = (userData) => {
  return api.post('/auth/signup', userData);
};

const login = async (credentials) => {
  // Make the POST request to the signin endpoint
  const response = await api.post('/auth/signin', credentials);
  
  // If the request is successful and we get data back...
  if (response.data.token) {
    // ...store the user object (which includes the token) in localStorage.
    // We stringify it because localStorage can only store strings.
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  // Return the data so our components can use it (e.g., to redirect the user).
  return response.data;
};

const logout = () => {
  // Logging out is as simple as removing the user object from localStorage.
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  // A helper function to easily get the current user data from localStorage.
  return JSON.parse(localStorage.getItem('user'));
};

// Export all the functions so they can be used elsewhere in the app.
const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;