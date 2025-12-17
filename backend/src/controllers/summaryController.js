// src/controllers/summaryController.js
const { Transaction, CircleMember } = require('../models');

async function ensureUserInCircle(userId, circleId) {
  const membership = await CircleMember.findOne({
    where: { userId, circleId, status: 'active' }
  });
  return !!membership;
}

// GET /circles/:circleId/summary?ref_month=YYYY-MM
async function getMonthlySummary(req, res) {
  try {
    const userId = req.user.id;
    const { circleId } = req.params;
    const { ref_month } = req.query;

    const isMember = await ensureUserInCircle(userId, circleId);
    if (!isMember) {
      return res.status(403).json({ message: 'Usuário não pertence a este círculo.' });
    }

    if (!ref_month) {
      return res.status(400).json({ message: 'Parâmetro ref_month é obrigatório (YYYY-MM).' });
    }

    const where = { circleId, refMonth: ref_month };

    const items = await Transaction.findAll({ where });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of items) {
      if (tx.type === 'income') {
        totalIncome += Number(tx.amount);
      } else if (tx.type === 'expense') {
        totalExpense += Number(tx.amount);
      }
    }

    const balance = totalIncome - totalExpense;

    return res.json({
      refMonth: ref_month,
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao obter resumo mensal.' });
  }
}

module.exports = {
  getMonthlySummary,
};