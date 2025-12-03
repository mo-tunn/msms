/**
 * Authentication Utility Functions
 * Handles storage and retrieval of auth tokens and user data
 * across localStorage (persistent) and sessionStorage (session-only).
 */

export const setAuth = (token, user, rememberMe) => {
    if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
    }
};

export const getAuth = () => {
    try {
        const localToken = localStorage.getItem('token');
        const localUser = localStorage.getItem('user');

        if (localToken && localUser) {
            const user = JSON.parse(localUser);
            if (user && user.role_id) {
                return { token: localToken, user };
            }
        }

        const sessionToken = sessionStorage.getItem('token');
        const sessionUser = sessionStorage.getItem('user');

        if (sessionToken && sessionUser) {
            const user = JSON.parse(sessionUser);
            if (user && user.role_id) {
                return { token: sessionToken, user };
            }
        }
    } catch (e) {
        console.error("Auth parsing error", e);
        clearAuth();
    }
    return null;
};

export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

export const isAuthenticated = () => {
    return !!getAuth();
};
