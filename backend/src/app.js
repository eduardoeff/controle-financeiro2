// backend/src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas base
app.get('/', (req, res) => {
  res.json({ message: 'API Controle Financeiro - OK' });
});

app.use('/api/auth', authRoutes);

// se tiver mais, adicione aqui

module.exports = app; // <-- exporta o app diretamente