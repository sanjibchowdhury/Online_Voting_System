import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar'; 

const ProtectedRoutes = () => {
  const { user, logout } = useAuth(); 
  
  
  return user ? (
    <>
      <Navbar user={user} onLogout={logout} /> 
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoutes;