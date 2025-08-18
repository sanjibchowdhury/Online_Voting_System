import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-[#000080] text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    Online Voting System
                </Link>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
                    
                    {user ? (
                        <>
                            <p className="text-gray-300">Welcome, {user.username}!</p>
                            <Link to="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
                            <button
                                onClick={logout}
                                className="bg-[#FF9933] hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300 transition-colors">Login</Link>
                            <Link to="/register" className="bg-[#138808] hover:bg-green-700 text-white px-3 py-1 rounded transition-colors">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;