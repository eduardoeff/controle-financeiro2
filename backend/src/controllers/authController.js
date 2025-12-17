// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Circle, CircleMember } = require('../models');
require('dotenv').config();

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  });
}

// POST /auth/register
async function register(req, res) {
  try {
    const { name, lastName, phone, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      lastName,
      phone,
      email,
      passwordHash,
    });

    // Cria um círculo padrão para o usuário (família)
    const circle = await Circle.create({
      name: `${name} ${lastName} - Família`,
      ownerUserId: user.id,
      maxMembers: 6,
    });

    await CircleMember.create({
      circleId: circle.id,
      userId: user.id,
      role: 'owner',
      status: 'active',
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      circle: {
        id: circle.id,
        name: circle.name,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ message: 'Email ou senha inválidos.' });
    }

    const token = generateToken(user.id);

    // Buscar círculos em que o usuário participa
    const memberships = await CircleMember.findAll({
      where: { userId: user.id },
      include: [Circle],
    });

    const circles = memberships.map((m) => ({
      id: m.Circle.id,
      name: m.Circle.name,
      role: m.role,
    }));

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      circles,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
}

module.exports = {
  register,
  login,
};