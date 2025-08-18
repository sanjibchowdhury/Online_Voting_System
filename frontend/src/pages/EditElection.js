import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditElection = () => {
    const { electionId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', description: '', endTime: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchElection = async () => {
            try {
                const res = await api.get(`/elections/${electionId}`);
                const formattedEndTime = new Date(res.data.endTime).toISOString().slice(0, 16);
                setFormData({
                    title: res.data.title,
                    description: res.data.description,
                    endTime: formattedEndTime,
                });
            } catch (err) {
                setError('Failed to load election data.');
            } finally {
                setLoading(false);
            }
        };
        fetchElection();
    }, [electionId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
           
            const payload = { ...formData };
            if (new Date(payload.endTime) > new Date()) {
                payload.status = 'active';
            }
            
            await api.patch(`/elections/update/${electionId}`, payload);
            alert('Election updated successfully!');
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update election.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading election...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-[#000080] mb-8 text-center">Edit Election</h1>
                <div className="bg-white rounded-lg shadow-md p-6">
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block font-semibold mb-1">Election Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block font-semibold mb-1">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block font-semibold mb-1">End Time</label>
                            <input
                                type="datetime-local"
                                id="endTime"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditElection;