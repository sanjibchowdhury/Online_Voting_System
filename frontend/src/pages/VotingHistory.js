
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const VotingHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/votes/history');
                setHistory(res.data);
            } catch (err) {
                setError('Failed to fetch voting history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading your voting history...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">My Voting History</h1>
                {history.length === 0 ? (
                    <p className="text-center text-gray-500">You have not cast any votes yet.</p>
                ) : (
                    <div className="space-y-6">
                        {history.map((vote) => (
                            <div key={vote._id} className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-[#000080] mb-2">{vote.election.title}</h2>
                                <p className="text-gray-600 mb-4">You voted for: <span className="font-bold">{vote.candidate.name}</span> ({vote.candidate.party})</p>
                                <p className="text-sm text-gray-500">Voted on: {new Date(vote.votedAt).toLocaleString()}</p>
                                <p className="text-sm text-gray-500 capitalize">Election Status: {vote.election.status}</p>
                                {vote.election.status === 'completed' && (
                                    <button
                                        onClick={() => navigate(`/results/${vote.election._id}`)}
                                        className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                                    >
                                        View Final Results
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotingHistory;