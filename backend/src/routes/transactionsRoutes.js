// src/routes/transactionsRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const transactionsController = require('../controllers/transactionsController');

router.use(authMiddleware);

// Criar transação
router.post('/circles/:circleId/transactions', transactionsController.createTransaction);

// Listar transações (com filtros)
router.get('/circles/:circleId/transactions', transactionsController.listTransactions);

module.exports = router;