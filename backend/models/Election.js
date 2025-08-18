const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
    }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'inactive' }
});

module.exports = mongoose.model('Election', electionSchema);