import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole) {
    const userData = JSON.parse(user);
    if (userData.role !== requiredRole) {
      return <Navigate to="/login" />;
    }
  }

  return children;
}

export default PrivateRoute;
