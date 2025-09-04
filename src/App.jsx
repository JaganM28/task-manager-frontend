// Filepath: src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage'; // Import the new page
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Make this route dynamic to accept IDs */}
        <Route path="/workspace/:workspaceId/board/:boardId" element={<BoardPage />} />
         {/* A simplified route for now */}
        <Route path="/workspace/:workspaceId" element={<BoardPage />} />
      </Route>
    </Routes>
  );
}

export default App;