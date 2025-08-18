import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth(); 
  
  
  const [isEditing, setIsEditing] = useState(false);
  
  const [username, setUsername] = useState(user.username);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <div className="text-center mt-10">Please log in to view your profile.</div>;
  }

  const handleSave = async () => {
    if (username === user.username) {
        setIsEditing(false);
        return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
        const res = await api.patch('/users/profile', { username });
        updateUser(res.data.user); 
        setSuccess(res.data.message);
        setIsEditing(false);
    } catch (err) {
        setError(err.response?.data?.message || 'Update failed.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-[#000080] mb-6 text-center">My Profile</h1>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <div className="space-y-4 text-lg">
       
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-gray-600">Username:</span>
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-gray-800 p-1 border rounded"
              />
            ) : (
              <span className="text-gray-800">{user.username}</span>
            )}
          </div>

       
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          
         
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="text-gray-800 capitalize">{user.role}</span>
          </div>
        </div>

       
        <div className="mt-8 flex justify-center space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Edit Username
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;