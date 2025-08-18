
import React, { useState } from 'react';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const res = await api.post('/users/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-[#000080]">Forgot Password</h2>
                <p className="text-center text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
                
                {message && <p className="text-green-600 bg-green-100 p-3 rounded text-center mb-4">{message}</p>}
                {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center mb-4">{error}</p>}

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#FF9933]"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#138808] text-white font-semibold p-3 rounded-lg mt-6 hover:bg-green-700 transition disabled:bg-gray-400"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;