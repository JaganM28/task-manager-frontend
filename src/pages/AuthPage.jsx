// Filepath: src/pages/AuthPage.jsx

import React, { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const pageStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  fontFamily: 'sans-serif',
};

const formContainerStyles = {
  width: '350px',
  padding: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

const toggleStyles = {
  marginTop: '1.5rem',
  border: 'none',
  background: 'none',
  color: '#007bff',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError('');
    try {
      await authService.login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setIsLoading(true);
    setError('');
    try {
      await authService.register(userData);
      setIsLoginView(true);
      alert('Registration successful! Please log in.'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageStyles}>
      <div style={formContainerStyles}>
        {isLoginView ? (
          <Login onLogin={handleLogin} isLoading={isLoading} error={error} />
        ) : (
          <Register onRegister={handleRegister} isLoading={isLoading} error={error} />
        )}

        <button style={toggleStyles} onClick={() => setIsLoginView(!isLoginView)}>
          {isLoginView ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;