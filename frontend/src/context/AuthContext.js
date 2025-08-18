import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
            const { user, token } = res.data;
            setUser(user);
            setToken(token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            navigate("/dashboard");
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate("/login");
    };

    // ## নতুন ফাংশন: ইউজার ডেটা আপডেট করার জন্য ##
    const updateUser = (newUserData) => {
        setUser(prevUser => {
            const updatedUser = { ...prevUser, ...newUserData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    return (
        // ## updateUser ফাংশনটি এখানে যোগ করা হয়েছে ##
        <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);