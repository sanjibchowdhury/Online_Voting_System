const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party: { type: String, required: true },
    votes: { type: Number, default: 0 },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election'
    },
    photoUrl: { type: String }, 
    description: { type: String } 
});

module.exports = mongoose.model('Candidate', candidateSchema);