// backend/src/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function register(req, res) {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    // Validação dos campos que o FRONT realmente envia
    if (!firstName || !lastName || !phone || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Campos obrigatórios faltando.' });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'E-mail já cadastrado.' });
    }

    // Monta o nome completo (se seu model tiver campo "name")
    const name = `${firstName} ${lastName}`.trim();

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return res.status(201).json({
      message: 'Usuário criado com sucesso.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Erro no register:', error);
    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
}

module.exports = {
  register,
  login,
};