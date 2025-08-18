
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const ElectionResultDetail = ({ election }) => {
    const winner = election.candidates[0] || null;
    const runnerUp = election.candidates[1] || null;
    const margin = winner && runnerUp ? winner.votes - runnerUp.votes : (winner ? winner.votes : 0);
    const totalVotes = election.candidates.reduce((acc, c) => acc + c.votes, 0);

    return (
        <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
            <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">{election.title} - Final Result</h1>
            {winner && (
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">🏆 WINNER 🏆</h2>
                    <img src={winner.photoUrl || "https://placehold.co/150x150"} alt={winner.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" />
                    <h3 className="text-3xl font-bold">{winner.name}</h3>
                    <p className="text-gray-600 text-lg">{winner.party}</p>
                    <p className="text-2xl font-semibold mt-2">{winner.votes} Votes</p>
                    <p className="text-gray-500 mt-2">Won by a margin of {margin} votes.</p>
                </div>
            )}
            <div>
                <h2 className="text-2xl font-bold mb-4">Full Standings ({totalVotes} Total Votes)</h2>
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
    );
};

const Results = () => {
    const { electionId } = useParams();
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompletedElections = async () => {
            try {
                const res = await api.get('/elections');
                const completed = res.data
                    .filter(e => e.status === 'completed')
                    .map(e => {
                        e.candidates.sort((a, b) => b.votes - a.votes);
                        return e;
                    });
                setElections(completed);
            } catch (err) {
                setError('Failed to fetch election results.');
            } finally {
                setLoading(false);
            }
        };
        fetchCompletedElections();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading results...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    const singleElection = electionId ? elections.find(e => e._id === electionId) : null;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                {singleElection ? (
                    <ElectionResultDetail election={singleElection} />
                ) : (
                    <>
                        <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">All Completed Election Results</h1>
                        {elections.length === 0 ? (
                            <p className="text-center text-gray-500">No completed elections are available to show results.</p>
                        ) : (
                            elections.map(election => (
                                <div key={election._id} className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{election.title}</h2>
                                        <p className="text-gray-600">Winner: {election.candidates[0]?.name || 'N/A'}</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/results/${election._id}`)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Results;