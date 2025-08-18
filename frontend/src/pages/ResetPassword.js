import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const res = await api.post(`/users/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-[#000080]">Reset Password</h2>
                
                {message && <p className="text-green-600 bg-green-100 p-3 rounded text-center mb-4">{message}</p>}
                {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center mb-4">{error}</p>}

                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#FF9933]"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#FF9933]"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#138808] text-white font-semibold p-3 rounded-lg mt-6 hover:bg-green-700 transition disabled:bg-gray-400"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;