const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to MongoDB database'))
.catch(err => console.error('Could not connect to MongoDB', err));


app.use('/api', transactionRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
