import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './context/auth.context';

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.isAuthenticated) {
        // Redirect to home if not authenticated (user can open login modal from there)
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

