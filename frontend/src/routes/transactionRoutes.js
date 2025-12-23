// backend/src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// GET /api/circles/:circleId/summary
router.get('/:circleId/summary', transactionController.getSummary);

// GET /api/circles/:circleId/transactions
router.get('/:circleId/transactions', transactionController.listTransactions);

// POST /api/circles/:circleId/transactions
router.post('/:circleId/transactions', transactionController.createTransaction);

// PUT /api/circles/:circleId/transactions/:id
router.put('/:circleId/transactions/:id', transactionController.updateTransaction);

// DELETE /api/circles/:circleId/transactions/:id
router.delete('/:circleId/transactions/:id', transactionController.deleteTransaction);

module.exports = router;