const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');


const updateExpiredElections = async () => {
    try {
        const now = new Date();
        await Election.updateMany(
            { endTime: { $lt: now }, status: 'active' },
            { $set: { status: 'completed' } }
        );
    } catch (err) {
   
        console.error("Background error updating expired elections:", err);
    }
};


router.post('/add', auth.authenticateToken, adminAuth, async (req, res) => {
    const { title, description, startTime, endTime } = req.body;
    try {
        const newElection = new Election({ title, description, startTime, endTime });
        await newElection.save();
        res.status(201).json(newElection);
    } catch (err) {
        console.error('ELECTION ADD FAILED:', err);
        res.status(400).json({ error: err.message });
    }
});
router.post('/candidates/:electionId', auth.authenticateToken, adminAuth, async (req, res) => {
    const { electionId } = req.params;
    const { name, party, photoUrl, description } = req.body;
    try {
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found' });
        const newCandidate = new Candidate({ name, party, photoUrl, description, election: electionId });
        await newCandidate.save();
        election.candidates.push(newCandidate._id);
        await election.save();
        res.status(201).json(newCandidate);
    } catch (err) {
        console.error('CANDIDATE ADD FAILED:', err);
        res.status(400).json({ error: err.message });
    }
});
router.delete('/candidates/delete/:candidateId', auth.authenticateToken, adminAuth, async (req, res) => {
    const { candidateId } = req.params;
    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        await Vote.deleteMany({ candidate: candidateId });
        await Election.findByIdAndUpdate(candidate.election, { $pull: { candidates: candidateId } });
        await Candidate.findByIdAndDelete(candidateId);
        res.status(200).json({ message: 'Candidate and associated votes deleted successfully' });
    } catch (err) {
        console.error('CANDIDATE DELETE FAILED:', err);
        res.status(400).json({ error: err.message });
    }
});
router.patch('/update/:electionId', auth.authenticateToken, adminAuth, async (req, res) => {
    const { electionId } = req.params;
    const updateData = { ...req.body };
    if (updateData.endTime && new Date(updateData.endTime) > new Date()) {
        const election = await Election.findById(electionId);
        if (election.status === 'completed') {
            updateData.status = 'active';
        }
    }
    try {
        const updatedElection = await Election.findByIdAndUpdate(electionId, updateData, { new: true });
        if (!updatedElection) return res.status(404).json({ message: 'Election not found' });
        res.status(200).json(updatedElection);
    } catch (err) {
        console.error('ELECTION UPDATE FAILED:', err);
        res.status(400).json({ error: err.message });
    }
});
router.delete('/delete/:electionId', auth.authenticateToken, adminAuth, async (req, res) => {
    const { electionId } = req.params;
    try {
        await Candidate.deleteMany({ election: electionId });
        await Vote.deleteMany({ election: electionId });
        await Election.findByIdAndDelete(electionId);
        res.status(200).json({ message: 'Election and its associated data deleted successfully' });
    } catch (err) {
        console.error('ELECTION DELETE FAILED:', err);
        res.status(400).json({ error: err.message });
    }
});


router.get('/', auth.authenticateToken, async (req, res) => {
    try {
        await updateExpiredElections();
        const elections = await Election.find().populate('candidates');
        const electionsWithVoteCount = elections.map(election => {
            const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
            const electionObject = election.toObject();
            electionObject.totalVotes = totalVotes;
            return electionObject;
        });
        res.status(200).json(electionsWithVoteCount);
    } catch (err) {
        console.error('GET ALL ELECTIONS FAILED:', err);
        res.status(500).json({ error: err.message });
    }
});
router.get('/results', auth.authenticateToken, adminAuth, async (req, res) => {
    try {
        await updateExpiredElections();
        const completedElections = await Election.find({ status: 'completed' })
            .populate({ path: 'candidates', options: { sort: { votes: -1 } } });
        const results = completedElections.map(election => {
            const winner = election.candidates[0] || null;
            const runnerUp = election.candidates[1] || null;
            const margin = winner && runnerUp ? winner.votes - runnerUp.votes : (winner ? winner.votes : 0);
            return {
                _id: election._id,
                title: election.title,
                winner: winner ? { name: winner.name, party: winner.party, votes: winner.votes } : null,
                margin: margin,
                totalVotes: election.candidates.reduce((acc, candidate) => acc + candidate.votes, 0)
            };
        });
        res.status(200).json(results);
    } catch (err) {
        console.error('FETCH RESULTS FAILED:', err);
        res.status(500).json({ message: 'Server error while fetching results' });
    }
});
router.get('/:electionId', auth.authenticateToken, async (req, res) => {
    try {
        await updateExpiredElections();
        const election = await Election.findById(req.params.electionId).populate('candidates');
        if (!election) return res.status(404).json({ message: 'Election not found' });
        res.status(200).json(election);
    } catch (err) {
        console.error('GET ELECTION BY ID FAILED:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:electionId/candidates', auth.authenticateToken, async (req, res) => {
    try {
        const candidates = await Candidate.find({ election: req.params.electionId });
        res.status(200).json(candidates);
    } catch (err) {
        console.error('GET CANDIDATES FAILED:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;