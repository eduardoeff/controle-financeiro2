const { Transaction } = require('../models');

async function getDashboardData(req, res) {
  try {
    // Por enquanto, retorna dados zerados ou mockados para o front não quebrar
    return res.json({
      balance: 0,
      revenue: 0,
      expenses: 0,
      chartData: [],
      recentTransactions: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar dashboard' });
  }
}

async function listTransactions(req, res) {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.userId },
      order: [['date', 'DESC']]
    });
    return res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar transações' });
  }
}

async function createTransaction(req, res) {
  try {
    const { date, type, category, value, description, status } = req.body;
    const transaction = await Transaction.create({
      date,
      type,
      category,
      value,
      description,
      status,
      userId: req.userId
    });
    return res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar transação' });
  }
}

module.exports = { getDashboardData, listTransactions, createTransaction };