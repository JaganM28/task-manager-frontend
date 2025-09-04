// Filepath: src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/authService';

const ProtectedRoute = () => {
  const user = authService.getCurrentUser();

  // If there's no user, redirect to the login page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If the user is logged in, render the child components (the actual page)
  return <Outlet />;
};

export default ProtectedRoute;