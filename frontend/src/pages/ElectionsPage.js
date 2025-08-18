import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const ElectionsPage = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const res = await api.get('/elections');
                
                const activeElections = res.data.filter(e => e.status === 'active');
                setElections(activeElections);
            } catch (err) {
                setError('Failed to fetch elections.');
            } finally {
                setLoading(false);
            }
        };
        fetchElections();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading elections...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">Active Elections</h1>
                {elections.length === 0 ? (
                    <div className="text-center text-gray-500">No active elections available at the moment.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {elections.map((election) => (
                            <div key={election._id} className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-2 text-[#000080]">{election.title}</h2>
                                <p className="text-gray-600 mb-4">{election.description}</p>
                                <p className="text-sm text-gray-500">Starts: {new Date(election.startTime).toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Ends: {new Date(election.endTime).toLocaleString()}</p>
                                <Link to={`/vote/${election._id}`} className="mt-4 inline-block bg-[#138808] text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                                    Vote Now
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ElectionsPage;