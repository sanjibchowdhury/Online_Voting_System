import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await api.get('/candidates');
                setCandidates(res.data);
            } catch (err) {
                setError('Failed to fetch candidates.');
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading candidates...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">Candidates</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map((candidate) => (
                        <div key={candidate._id} className="bg-white rounded-lg shadow-md p-6 text-center">
                            <h2 className="text-xl font-semibold text-[#000080]">{candidate.name}</h2>
                            <p className="text-gray-600">{candidate.party}</p>
                            <p className="mt-2 text-gray-500">Votes: {candidate.votes}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CandidateList;