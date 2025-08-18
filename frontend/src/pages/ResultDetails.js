import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ResultDetails = () => {
    const { electionId } = useParams();
    const [election, setElection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/elections/${electionId}`);
                res.data.candidates.sort((a, b) => b.votes - a.votes);
                setElection(res.data);
            } catch (err) {
                setError('Failed to fetch election details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [electionId]);

    if (loading) return <div className="text-center mt-10">Loading details...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!election) return null;

    const winner = election.candidates[0] || null;
    const runnerUp = election.candidates[1] || null;
    const margin = winner && runnerUp ? winner.votes - runnerUp.votes : (winner ? winner.votes : 0);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">{election.title} - Final Result</h1>
                
                {winner && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">🏆 WINNER 🏆</h2>
                        <img src={winner.photoUrl || "https://placehold.co/150x150"} alt={winner.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" />
                        <h3 className="text-3xl font-bold">{winner.name}</h3>
                        <p className="text-gray-600 text-lg">{winner.party}</p>
                        <p className="text-2xl font-semibold mt-2">{winner.votes} Votes</p>
                        <p className="text-gray-500 mt-2">Won by a margin of {margin} votes.</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Full Standings</h2>
                    <ul className="space-y-4">
                        {election.candidates.map((candidate, index) => (
                            <li key={candidate._id} className="border-b pb-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold mr-4">{index + 1}</span>
                                    <img src={candidate.photoUrl || "https://placehold.co/100x100"} alt={candidate.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
                                    <div>
                                        <h4 className="text-lg font-semibold">{candidate.name}</h4>
                                        <p className="text-gray-500">{candidate.party}</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold">{candidate.votes} Votes</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ResultDetails;