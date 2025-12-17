// src/controllers/transactionsController.js
const { Transaction, CircleMember } = require('../models');
const { getWeekDay } = require('../utils/weekDay');

// garante que o usuário é membro do círculo
async function ensureUserInCircle(userId, circleId) {
  const membership = await CircleMember.findOne({
    where: { userId, circleId, status: 'active' }
  });
  return !!membership;
}

// POST /circles/:circleId/transactions
async function createTransaction(req, res) {
  try {
    const userId = req.user.id;
    const { circleId } = req.params;

    const isMember = await ensureUserInCircle(userId, circleId);
    if (!isMember) {
      return res.status(403).json({ message: 'Usuário não pertence a este círculo.' });
    }

    const {
      date,
      type,          // income | expense
      personRole,
      category,
      amount,
      description,
      paymentMethod,
      status,        // pending | paid (para despesas)
      isFixed
    } = req.body;

    if (!date || !type || !personRole || !category || !amount) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const weekDay = getWeekDay(date);
    const refMonth = date.slice(0, 7); // YYYY-MM

    const tx = await Transaction.create({
      circleId,
      userId,
      date,
      weekDay,
      type,
      personRole,
      category,
      amount,
      description,
      paymentMethod,
      status: type === 'expense' ? (status || 'paid') : null,
      isFixed: !!isFixed,
      refMonth
    });

    return res.status(201).json(tx);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar transação.' });
  }
}

// GET /circles/:circleId/transactions
// filtros: ref_month, type, category, person_role, status
async function listTransactions(req, res) {
  try {
    const userId = req.user.id;
    const { circleId } = req.params;

    const isMember = await ensureUserInCircle(userId, circleId);
    if (!isMember) {
      return res.status(403).json({ message: 'Usuário não pertence a este círculo.' });
    }

    const { ref_month, type, category, person_role, status } = req.query;

    const where = { circleId };

    if (ref_month) where.refMonth = ref_month;
    if (type) where.type = type;
    if (category) where.category = category;
    if (person_role) where.personRole = person_role;
    if (status) where.status = status;

    const items = await Transaction.findAll({
      where,
      order: [['date', 'ASC'], ['id', 'ASC']]
    });

    return res.json({ items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar transações.' });
  }
}

module.exports = {
  createTransaction,
  listTransactions,
};