import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await api.get('/elections/results');
                setResults(res.data);
            } catch (err) {
                setError('Failed to fetch results.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading results...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">Completed Election Results</h1>
                {results.length === 0 ? (
                    <p className="text-center text-gray-500">No completed elections found.</p>
                ) : (
                    <div className="space-y-4">
                        {results.map((result) => (
                            <div key={result._id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold">{result.title}</h2>
                                    {result.winner ? (
                                        <p className="text-green-600">Winner: {result.winner.name} ({result.winner.votes} votes)</p>
                                    ) : (
                                        <p className="text-gray-500">No winner declared.</p>
                                    )}
                                    <p className="text-sm text-gray-500">Total Votes: {result.totalVotes}</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/admin/results/${result._id}`)}
                                    className="bg-[#FF9933] text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminResults;