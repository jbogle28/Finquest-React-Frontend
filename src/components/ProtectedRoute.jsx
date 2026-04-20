import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
    const user = authService.getCurrentUser();

    // If no user is found in localStorage, redirect to login
    if (!user || !user.access_token) {
        return <Navigate to="/login" replace />;
    }

    // If user exists, render the component (children)
    return children;
};

export default ProtectedRoute;