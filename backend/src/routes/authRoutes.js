// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Registrar usuário
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Usuário logado
router.get('/me', authMiddleware, authController.me);

module.exports = router;