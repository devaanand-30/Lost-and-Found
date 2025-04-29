import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const ProtectedRoute = ({ children, admin = false }) => {
  const { user } = useAuth();

  // Redirect to login if no user is authenticated
  if (!user) return <Navigate to='/login' replace />;

  // Redirect to home if user is not an admin and 'admin' prop is passed
  if (admin && !user.isAdmin) return <Navigate to='/' replace />;

  // Render the children if user is authenticated (and admin condition is met, if applicable)
  return children;
};

export default ProtectedRoute;
