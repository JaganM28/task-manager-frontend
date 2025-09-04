// Filepath: src/components/Navbar.jsx 

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const navStyles = {
    backgroundColor: '#026AA7',
    padding: '8px 16px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const navLinkStyles = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    padding: '6px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
};

const backButtonHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
};

const logoutButtonStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const HomeIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav style={navStyles}>
      {isDashboard ? (
        <span style={{...navLinkStyles, fontSize: '1.2rem'}}>Task Manager</span>
      ) : (
        <Link 
            to="/dashboard" 
            style={navLinkStyles}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = backButtonHoverStyle.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
            <HomeIcon /> 
            <span>Workspaces</span>
        </Link>
      )}
      <div>
        <span style={{ marginRight: '16px' }}>{currentUser?.username}</span>
        <button onClick={handleLogout} style={logoutButtonStyles}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;