// src/models/Transaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  weekDay: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING, allowNull: false }, // income | expense | adjustment
  personRole: { type: DataTypes.STRING, allowNull: false }, // Motorista | Esposa | Família
  description: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentMethod: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING }, // pending | paid
  installmentNumber: { type: DataTypes.INTEGER },
  installmentTotal: { type: DataTypes.INTEGER },
  isFixed: { type: DataTypes.BOOLEAN, defaultValue: false },
  refMonth: { type: DataTypes.STRING }
});

module.exports = Transaction;