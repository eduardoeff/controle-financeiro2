// src/routes/summaryRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const summaryController = require('../controllers/summaryController');

router.use(authMiddleware);

router.get('/circles/:circleId/summary', summaryController.getMonthlySummary);

module.exports = router;