import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const DeactivateModal = ({ election, onClose, onConfirm }) => {
    if (!election) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-2">Deactivate Election</h2>
                <p className="text-gray-600 mb-4">You are deactivating: <span className="font-semibold">{election.title}</span></p>
                <p className="mb-6">Please choose how you would like to proceed.</p>
                <div className="space-y-4">
                    <div>
                        <button
                            onClick={() => onConfirm('inactive')}
                            className="w-full bg-yellow-500 text-white p-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
                        >
                            Hold & Deactivate
                        </button>
                        <p className="text-xs text-gray-500 mt-1 text-center">Suspends voting and sets the status to 'Inactive'. You can re-activate it later.</p>
                    </div>
                    <div>
                        <button
                            onClick={() => onConfirm('completed')}
                            className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition"
                        >
                            End Election & Publish Results
                        </button>
                        <p className="text-xs text-gray-500 mt-1 text-center">Sets the end time to now, finalizes votes, and publishes the results.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-300 text-gray-800 p-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newElection, setNewElection] = useState({ title: '', description: '', startTime: '', endTime: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

  
    const [showModal, setShowModal] = useState(false);
    const [selectedElection, setSelectedElection] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
        } else {
            fetchElections();
        }
    }, [user, navigate]);

    const fetchElections = async () => {
        try {
            const res = await api.get('/elections');
            setElections(res.data);
        } catch (err) {
            setError('Failed to fetch elections.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateElection = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await api.post('/elections/add', newElection);
            setNewElection({ title: '', description: '', startTime: '', endTime: '' });
            await fetchElections();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create election.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteElection = async (electionId) => {
        if (window.confirm('Are you sure you want to delete this election? This action cannot be undone.')) {
            try {
                await api.delete(`/elections/delete/${electionId}`);
                await fetchElections();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete election.');
            }
        }
    };

    const handleDeactivateClick = (election) => {
        setSelectedElection(election);
        setShowModal(true);
    };

    const handleDeactivationConfirm = async (action) => {
        if (!selectedElection) return;
        let payload = {};
        if (action === 'inactive') {
            payload = { status: 'inactive' };
        } else if (action === 'completed') {
            payload = { status: 'completed', endTime: new Date().toISOString() };
        }
        try {
            await api.patch(`/elections/update/${selectedElection._id}`, payload);
            await fetchElections();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status.');
        } finally {
            setShowModal(false);
            setSelectedElection(null);
        }
    };

    const handleStatusChange = async (electionId, status) => {
        try {
            await api.patch(`/elections/update/${electionId}`, { status });
            await fetchElections();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update election status.');
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading admin panel...</div>;
    }

    return (
        <>
            {showModal && (
                <DeactivateModal
                    election={selectedElection}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleDeactivationConfirm}
                />
            )}
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">Admin Panel</h1>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Create New Election</h2>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <form onSubmit={handleCreateElection} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Election Title"
                                value={newElection.title}
                                onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                                className="w-full border p-2 rounded"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newElection.description}
                                onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                            <div className="flex flex-col sm:flex-row sm:space-x-4">
                                <input
                                    type="datetime-local"
                                    value={newElection.startTime}
                                    onChange={(e) => setNewElection({ ...newElection, startTime: e.target.value })}
                                    className="w-full border p-2 rounded mb-4 sm:mb-0"
                                    required
                                />
                                <input
                                    type="datetime-local"
                                    value={newElection.endTime}
                                    onChange={(e) => setNewElection({ ...newElection, endTime: e.target.value })}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#138808] text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Election'}
                            </button>
                        </form>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Manage Elections</h2>
                        <div className="space-y-4">
                            {elections.map((election) => (
                                <div key={election._id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div className="mb-4 sm:mb-0">
                                        <h3 className="text-xl font-bold">{election.title}</h3>
                                        <p className="text-gray-600 capitalize">Status: {election.status}</p>
                                        <p className="text-sm">Start: {new Date(election.startTime).toLocaleString()}</p>
                                        <p className="text-sm">End: {new Date(election.endTime).toLocaleString()}</p>
                                        <p className="text-sm font-semibold mt-2 text-indigo-600">
                                            {election.status === 'active' && `Current Votes: ${election.totalVotes}`}
                                            {election.status === 'completed' && `Final Votes: ${election.totalVotes}`}
                                            {election.status === 'inactive' && `Votes: 0 (Not Started)`}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center space-x-2 self-start sm:self-center">
                                        {(election.status === 'inactive' || (election.status === 'completed' && new Date(election.endTime) > new Date())) && (
                                            <button
                                                onClick={() => handleStatusChange(election._id, 'active')}
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                            >
                                                Activate
                                            </button>
                                        )}
                                        {election.status === 'active' && (
                                            <button
                                                onClick={() => handleDeactivateClick(election)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Deactivate
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate(`/admin/edit-election/${election._id}`)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/elections/${election._id}`)}
                                            className="bg-[#FF9933] text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                                        >
                                            Manage
                                        </button>
                                        <button
                                            onClick={() => handleDeleteElection(election._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;