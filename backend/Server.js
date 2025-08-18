const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const electionRoutes = require('./routes/electionRoutes');
const userRoutes = require('./routes/userRoutes');
const voteRoutes = require('./routes/VoteRoute');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/elections', electionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/votes', voteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/`);
});