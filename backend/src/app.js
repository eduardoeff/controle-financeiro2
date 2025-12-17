// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/', transactionsRoutes);
app.use('/', summaryRoutes);

// Rota simples de teste
app.get('/', (req, res) => {
  res.send('API Controle Financeiro rodando');
});

const PORT = process.env.PORT || 4000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });