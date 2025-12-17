// src/models/CircleMember.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CircleMember = sequelize.define('CircleMember', {
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'member' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' }
});

module.exports = CircleMember;