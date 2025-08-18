import React from "react";
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center px-6 py-16 bg-[#1A73E8] text-white">
        <div className="max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            🗳️ 🙋 ✅ Secure, Fast & Easy <span className="text-[#000080]">Online Voting</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            Cast your vote from anywhere, anytime. Your voice matters — make it count in just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Login to Vote button */}
            <Link
              to="/login"
              className="bg-[#000080] text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transform transition-transform duration-300 hover:scale-105"
            >
              Login to Vote
            </Link>
            {/* Register Now button with default green color and zoom effect */}
            <Link
              to="/register"
              className="bg-[#138808] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transform transition-transform duration-300 hover:scale-105"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white text-gray-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3 text-center">
          {/* Card 1: Secure Voting */}
          <div className="p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-bold mb-3">🔒 Secure Voting</h3>
            <p>End-to-end encryption ensures your vote stays private and secure.</p>
          </div>
          {/* Card 2: Fast Process */}
          <div className="p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-bold mb-3">⚡ Fast Process</h3>
            <p>Cast your vote in under a minute from any device with internet.</p>
          </div>
          {/* Card 3: Accessible Anywhere */}
          <div className="p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-bold mb-3">🌍 Accessible Anywhere</h3>
            <p>Vote from the comfort of your home or on the go, anywhere in the world.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center bg-[#FF5252]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Ready to Make Your Voice Heard?
        </h2>
        {/* Get Started button */}
        <Link
          to="/register"
          className="bg-[#000080] text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transform transition-transform duration-300 hover:scale-105"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}