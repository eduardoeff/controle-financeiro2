const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // Todas as rotas de transação precisam de login

router.get('/dashboard', transactionController.getDashboardData);
router.get('/', transactionController.listTransactions);
router.post('/', transactionController.createTransaction);

module.exports = router;