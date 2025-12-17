// src/config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Vamos usar SQLite em arquivo, para ficar simples no seu computador
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'database.sqlite'),
  logging: false
});

module.exports = sequelize;