const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Route setup
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(5000, () => console.log('Server is running on port 5000')))
    .catch(err => console.log(err));

