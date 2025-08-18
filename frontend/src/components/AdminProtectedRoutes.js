import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoutes = () => {
    const { user } = useAuth();
    return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminProtectedRoutes;