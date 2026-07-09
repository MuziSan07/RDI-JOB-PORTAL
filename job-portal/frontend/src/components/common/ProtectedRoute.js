import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

// Where each role belongs — used to bounce a user who wanders into another role's area.
const HOME_BY_ROLE = {
    super_admin: '/admin/dashboard',
    department: '/department/dashboard',
    job_seeker: '/dashboard',
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = authService.getStoredUser();

    const requiresJobSeeker = Array.isArray(allowedRoles) && allowedRoles.includes('job_seeker');

    // Not authenticated → send to the login screen appropriate for this area
    if (!token || !user) {
        return <Navigate to={requiresJobSeeker ? '/login' : '/admin/login'} replace />;
    }

    // Authenticated but not allowed here → send them back to THEIR OWN home
    if (allowedRoles && !allowedRoles.includes(user.user_type)) {
        return <Navigate to={HOME_BY_ROLE[user.user_type] || '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;
