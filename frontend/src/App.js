import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ElectionsPage from "./pages/ElectionsPage";
import AdminPanel from "./pages/AdminPanel";
import ManageElection from "./pages/ManageElection";
import AdminProtectedRoutes from "./components/AdminProtectedRoutes";
import CandidateList from "./pages/CandidateList";
import VotePage from "./pages/VotePage";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import AdminResults from "./pages/AdminResults";
import ResultDetails from "./pages/ResultDetails";
import EditElection from "./pages/EditElection";
import VotingHistory from "./pages/VotingHistory";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                
                {user ? (
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/elections" element={<ElectionsPage />} />
                        <Route path="/elections/:electionId/candidates" element={<CandidateList />} />
                        <Route path="/vote/:electionId" element={<VotePage />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/results/:electionId" element={<Results />} />
                        <Route path="/history" element={<VotingHistory />} />

                        {/* Admin Routes */}
                        <Route element={<AdminProtectedRoutes />}>
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="/admin/elections/:electionId" element={<ManageElection />} />
                            <Route path="/admin/results" element={<AdminResults />} />
                            <Route path="/admin/results/:electionId" element={<ResultDetails />} />
                            <Route path="/admin/edit-election/:electionId" element={<EditElection />} />
                        </Route>
                    </>
                ) : (
                    <Route path="/*" element={<Navigate to="/login" replace />} />
                )}
                
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;