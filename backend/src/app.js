// backend/src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes'); // NOVO

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Controle Financeiro - OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/circles', transactionRoutes); // NOVO

module.exports = app;