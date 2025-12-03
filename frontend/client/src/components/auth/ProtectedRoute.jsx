import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth, clearAuth } from '../../utils/authUtils';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const auth = getAuth();

    if (!auth) {
        // Redirect to login if no token or user data found
        // For admin routes, redirect to admin login
        if (location.pathname.startsWith('/admin')) {
            return <Navigate to="/admin/login" replace state={{ from: location }} />;
        }
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    try {
        const { user } = auth;

        // Check if user has required role
        if (allowedRoles && !allowedRoles.includes(user.role_id)) {
            // Redirect based on their actual role
            if (user.role_id === 1) return <Navigate to="/admin/dashboard" replace />;
            if (user.role_id === 2) return <Navigate to="/mentor/ana-sayfa" replace />;
            if (user.role_id === 3) return <Navigate to="/student/ana-sayfa" replace />;

            return <Navigate to="/login" replace />;
        }

        return children;
    } catch (error) {
        // If something goes wrong, clear storage and redirect to login
        clearAuth();
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
};

export default ProtectedRoute;
