// backend/src/controllers/transactionController.js
const { Transaction } = require('../models');
const { Op } = require('sequelize');

// GET /api/circles/:circleId/summary?ref_month=YYYY-MM
async function getSummary(req, res) {
  try {
    const { circleId } = req.params;
    const { ref_month } = req.query; // ex: "2025-01"

    if (!ref_month) {
      return res.status(400).json({ message: 'ref_month é obrigatório (YYYY-MM)' });
    }

    // Buscar transações do mês
    const transactions = await Transaction.findAll({
      where: {
        circleId,
        date: {
          [Op.startsWith]: ref_month, // ex: "2025-01"
        },
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(tx => {
      if (tx.type === 'income') {
        totalIncome += parseFloat(tx.amount);
      } else if (tx.type === 'expense') {
        totalExpense += parseFloat(tx.amount);
      }
    });

    const balance = totalIncome - totalExpense;

    return res.json({
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    console.error('Erro no getSummary:', error);
    return res.status(500).json({ message: 'Erro ao buscar resumo.' });
  }
}

// GET /api/circles/:circleId/transactions?ref_month=...&type=...&category=...
async function listTransactions(req, res) {
  try {
    const { circleId } = req.params;
    const { ref_month, type, category, person_role, status } = req.query;

    const where = { circleId };

    if (ref_month) {
      where.date = { [Op.startsWith]: ref_month };
    }
    if (type) {
      where.type = type;
    }
    if (category) {
      where.category = { [Op.like]: `%${category}%` };
    }
    if (person_role) {
      where.personRole = person_role;
    }
    if (status) {
      where.status = status;
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['date', 'DESC']],
    });

    return res.json({ items: transactions });
  } catch (error) {
    console.error('Erro no listTransactions:', error);
    return res.status(500).json({ message: 'Erro ao listar transações.' });
  }
}

// POST /api/circles/:circleId/transactions
async function createTransaction(req, res) {
  try {
    const { circleId } = req.params;
    const { date, type, category, amount, description, personRole, status } = req.body;

    if (!date || !type || !category || !amount) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    // Calcular dia da semana
    const weekDay = getWeekDay(date);

    const transaction = await Transaction.create({
      circleId,
      userId: req.userId,
      date,
      weekDay,
      type,
      category,
      amount,
      description,
      personRole,
      status: type === 'expense' ? status || 'pending' : null,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro no createTransaction:', error);
    return res.status(500).json({ message: 'Erro ao criar transação.' });
  }
}

// PUT /api/circles/:circleId/transactions/:id
async function updateTransaction(req, res) {
  try {
    const { circleId, id } = req.params;
    const { date, type, category, amount, description, personRole, status } = req.body;

    const transaction = await Transaction.findOne({
      where: { id, circleId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada.' });
    }

    const weekDay = date ? getWeekDay(date) : transaction.weekDay;

    await transaction.update({
      date: date || transaction.date,
      weekDay,
      type: type || transaction.type,
      category: category || transaction.category,
      amount: amount !== undefined ? amount : transaction.amount,
      description: description !== undefined ? description : transaction.description,
      personRole: personRole || transaction.personRole,
      status: type === 'expense' ? status || transaction.status : null,
    });

    return res.json(transaction);
  } catch (error) {
    console.error('Erro no updateTransaction:', error);
    return res.status(500).json({ message: 'Erro ao atualizar transação.' });
  }
}

// DELETE /api/circles/:circleId/transactions/:id
async function deleteTransaction(req, res) {
  try {
    const { circleId, id } = req.params;

    const transaction = await Transaction.findOne({
      where: { id, circleId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada.' });
    }

    await transaction.destroy();

    return res.json({ message: 'Transação excluída com sucesso.' });
  } catch (error) {
    console.error('Erro no deleteTransaction:', error);
    return res.status(500).json({ message: 'Erro ao excluir transação.' });
  }
}

function getWeekDay(dateStr) {
  const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const d = new Date(dateStr + 'T00:00:00');
  return days[d.getDay()];
}

module.exports = {
  getSummary,
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};