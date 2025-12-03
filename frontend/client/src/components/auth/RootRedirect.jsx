import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, clearAuth } from '../../utils/authUtils';

const RootRedirect = () => {
    const auth = getAuth();

    if (auth) {
        try {
            const { user } = auth;
            if (user.role_id === 1) return <Navigate to="/admin/dashboard" replace />;
            if (user.role_id === 2) return <Navigate to="/mentor/ana-sayfa" replace />;
            if (user.role_id === 3) return <Navigate to="/student/ana-sayfa" replace />;
        } catch (e) {
            // If parsing fails, fall through to login
            clearAuth();
        }
    }

    return <Navigate to="/login" replace />;
};

export default RootRedirect;
