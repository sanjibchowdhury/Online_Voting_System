import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-[#000080]">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#FF9933]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#FF9933]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#138808] text-white font-semibold p-3 rounded-lg mt-6 hover:bg-green-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
            </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;