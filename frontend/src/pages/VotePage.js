import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const VotePage = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);
    const [electionTitle, setElectionTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    
    const [selectedCandidateId, setSelectedCandidateId] = useState(null); 
    const [showConfirmModal, setShowConfirmModal] = useState(false); 

    useEffect(() => {
        if (!electionId) return;
        const fetchElectionData = async () => {
            setLoading(true);
            try {
                const electionRes = await api.get(`/elections/${electionId}`);
                if (electionRes.data.status !== 'active') {
                    setError('This election is not currently active for voting.');
                    setLoading(false);
                    return;
                }
                setElectionTitle(electionRes.data.title);
                const candidatesRes = await api.get(`/elections/${electionId}/candidates`);
                setCandidates(candidatesRes.data);
            } catch (err) {
                setError('Failed to fetch election or candidate data.');
            } finally {
                setLoading(false);
            }
        };
        fetchElectionData();
    }, [electionId]);

   
    const handleConfirmVote = async () => {
        if (!selectedCandidateId) {
            setError('Please select a candidate first.');
            return;
        }
        setShowConfirmModal(false); 
        setMessage('');
        setError('');
        
        try {
            const res = await api.post(`/votes/${electionId}`, { candidateId: selectedCandidateId });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate(`/results/${electionId}`);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Voting failed.');
        }
    };

    
    const handleSelectCandidate = (candidateId) => {
        setSelectedCandidateId(candidateId);
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    const ConfirmationModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Confirm Your Vote</h2>
                <p className="mb-6 text-gray-700">Are you sure you want to cast your vote for this candidate? This action cannot be undone.</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setShowConfirmModal(false)}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmVote}
                        className="bg-green-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {showConfirmModal && <ConfirmationModal />}
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-[#000080] mb-2 text-center">Cast Your Vote</h1>
                    {electionTitle && <h2 className="text-2xl text-gray-700 mb-8 text-center">{electionTitle}</h2>}
                    
                    {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">{message}</div>}
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">{error}</div>}

                    {/* Candidate Selection Area */}
                    {!message && !error && candidates.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {candidates.map((candidate) => (
                               
                                <div 
                                    key={candidate._id} 
                                    onClick={() => handleSelectCandidate(candidate._id)}
                                    
                                    className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer transition-all duration-200 border-4 ${selectedCandidateId === candidate._id ? 'border-blue-500 shadow-xl' : 'border-transparent'}`}
                                >
                                    <img src={candidate.photoUrl || "https://placehold.co/150x150"} alt={candidate.name} className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg"/>
                                    <h2 className="text-xl font-semibold text-[#000080]">{candidate.name}</h2>
                                    <p className="text-gray-600">{candidate.party}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                 
                    {!message && !error && candidates.length > 0 && (
                        <div className="mt-12 text-center">
                            <button
                               
                                disabled={!selectedCandidateId}
                                onClick={() => setShowConfirmModal(true)}
                                className="bg-[#138808] text-white px-10 py-4 rounded-lg font-semibold text-xl hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Submit Vote
                            </button>
                        </div>
                    )}

                    {!loading && !error && candidates.length === 0 && (
                        <div className="text-center text-gray-500">No candidates are available for this election.</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default VotePage;