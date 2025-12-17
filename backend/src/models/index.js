// src/models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Circle = require('./Circle');
const CircleMember = require('./CircleMember');
const Invitation = require('./Invitation');
const Transaction = require('./Transaction');

// Relacionamentos
Circle.belongsTo(User, { as: 'owner', foreignKey: 'ownerUserId' });

CircleMember.belongsTo(Circle, { foreignKey: 'circleId' });
CircleMember.belongsTo(User, { foreignKey: 'userId' });

Invitation.belongsTo(Circle, { foreignKey: 'circleId' });
Invitation.belongsTo(User, { as: 'invitedBy', foreignKey: 'invitedByUserId' });

Transaction.belongsTo(Circle, { foreignKey: 'circleId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Circle,
  CircleMember,
  Invitation,
  Transaction
};