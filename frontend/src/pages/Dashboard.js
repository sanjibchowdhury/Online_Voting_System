
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  let cards = [
    {
      title: "View Elections",
      description: "Check all active elections and cast your vote.",
      link: "/elections",
      color: "from-[#FF9933] to-orange-500",
    },
    {
      title: "My Profile",
      description: "View and edit your user profile.",
      link: "/profile",
      color: "from-gray-500 to-gray-700",
    },
    {
      title: "View Results",
      description: "See results of completed elections.",
      link: "/results",
      color: "from-green-500 to-green-700",
    },
    {
        title: "My Voting History",
        description: "Review all the votes you have cast in the past.",
        link: "/history",
        color: "from-cyan-500 to-blue-500",
    }
  ];


  if (user && user.role === 'admin') {
      cards = [
        {
          title: "Admin Panel",
          description: "Manage elections and candidates.",
          link: "/admin",
          color: "from-[#000080] to-indigo-800",
        },
        ...cards
      ];
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.link)}
              className={`cursor-pointer bg-gradient-to-r ${card.color} text-white rounded-xl shadow-lg p-6 hover:scale-105 transform transition duration-300 flex flex-col`}
            >
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-sm opacity-90 flex-grow">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}