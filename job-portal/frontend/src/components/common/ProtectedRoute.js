import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = authService.getStoredUser();

    // Not authenticated
    if (!token || !user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Check if user has allowed role
    if (allowedRoles && !allowedRoles.includes(user.user_type)) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;