const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const auth = require('../middleware/auth');

router.post('/:electionId', auth.authenticateToken, async (req, res) => {
    try {
        const { candidateId } = req.body;
        const { electionId } = req.params;
        const userId = req.user.id;

        const election = await Election.findById(electionId);
        if (!election || election.status !== 'active') {
            return res.status(400).json({ message: 'Voting is not currently active for this election.' });
        }

        const existingVote = await Vote.findOne({ user: userId, election: electionId });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted in this election.' });
        }

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found.' });
        }

        candidate.votes += 1;
        await candidate.save();

        const newVote = new Vote({
            user: userId,
            candidate: candidateId,
            election: electionId
        });
        await newVote.save();

        res.status(201).json({ message: 'Vote submitted successfully!' });

    } catch (error) {
        console.error('VOTE SUBMISSION FAILED:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/history', auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const votes = await Vote.find({ user: userId })
            .populate({
                path: 'election',
                select: 'title description status' 
            })
            .populate({
                path: 'candidate',
                select: 'name party' 
            })
            .sort({ votedAt: -1 }); 

        res.status(200).json(votes);

    } catch (err) {
        console.error('FETCHING VOTE HISTORY FAILED:', err);
        res.status(500).json({ message: 'Server error while fetching vote history' });
    }
});

module.exports = router;