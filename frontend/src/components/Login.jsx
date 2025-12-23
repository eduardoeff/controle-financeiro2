// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // estado correto
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user, circles } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userId', user.id);

      if (circles && circles.length > 0) {
        localStorage.setItem('circleId', circles[0].id);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Email ou senha inválidos.');
    }
  }

  return (
    <div className="auth-container">
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>E-mail*</label>
          <input
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Senha*</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
              aria-label="Senha"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Entrar</button>
      </form>

      <div className="auth-links">
        <Link to="/register">✨ Criar conta</Link>
        <Link to="/forgot-password">🔑 Esqueci a senha</Link>
      </div>
    </div>
  );
}

export default Login;