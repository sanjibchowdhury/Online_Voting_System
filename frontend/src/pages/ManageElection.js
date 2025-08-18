import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ManageElection = () => {
    const { electionId } = useParams();
    const [election, setElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newCandidate, setNewCandidate] = useState({ name: '', party: '', photoUrl: '', description: '' });

    const fetchElectionData = useCallback(async () => {
        try {
          
            const electionRes = await api.get(`/elections/${electionId}`);
            setElection(electionRes.data);
            
            
            const candidatesRes = await api.get(`/elections/${electionId}/candidates`);
            setCandidates(candidatesRes.data);
        } catch (err) {
            setError('Failed to fetch election data.');
        } finally {
            setLoading(false);
        }
    }, [electionId]);

    useEffect(() => {
        fetchElectionData();
    }, [fetchElectionData]);

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
           
            await api.post(`/elections/candidates/${electionId}`, newCandidate);
            setNewCandidate({ name: '', party: '', photoUrl: '', description: '' });
            fetchElectionData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add candidate.');
        }
    };
    
    const handleDeleteCandidate = async (candidateId) => {
        if (window.confirm('Are you sure you want to delete this candidate?')) {
            try {
                
                await api.delete(`/elections/candidates/delete/${candidateId}`);
                fetchElectionData();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete candidate.');
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading election data...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">Manage: {election?.title}</h1>

                {/* Add New Candidate Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Add New Candidate</h2>
                    <form onSubmit={handleAddCandidate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Candidate Name"
                            value={newCandidate.name}
                            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Party"
                            value={newCandidate.party}
                            onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Photo URL"
                            value={newCandidate.photoUrl}
                            onChange={(e) => setNewCandidate({ ...newCandidate, photoUrl: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <textarea
                            placeholder="Description"
                            value={newCandidate.description}
                            onChange={(e) => setNewCandidate({ ...newCandidate, description: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <button
                            type="submit"
                            className="bg-[#138808] text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
                        >
                            Add Candidate
                        </button>
                    </form>
                </div>

                {/* Candidate List for this Election */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Candidates in this Election</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {candidates.map((candidate) => (
                            <div key={candidate._id} className="border p-4 rounded-lg flex flex-col items-center">
                                <img src={candidate.photoUrl || "https://placehold.co/150x150"} alt={candidate.name} className="w-24 h-24 rounded-full mb-2 object-cover" />
                                <h3 className="text-lg font-bold">{candidate.name}</h3>
                                <p className="text-gray-600">{candidate.party}</p>
                                <button
                                    onClick={() => handleDeleteCandidate(candidate._id)}
                                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageElection;