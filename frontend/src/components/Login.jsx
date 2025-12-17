// src/components/Login.jsx
import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin, onGoToRegister, onGoToForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

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

      if (onLogin) onLogin();
    } catch (err) {
      console.error(err);
      setError('Email ou senha inválidos.');
    }
  }

  return (
    <div className="auth-container">
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Senha*</label>
          <div className="password-wrapper">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPass(p => !p)}
            >
              {showPass ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary">
          Entrar
        </button>

        <div className="auth-links">
          <button
            type="button"
            className="link-button"
            onClick={onGoToForgotPassword}
          >
            Esqueci a senha
          </button>
          <button
            type="button"
            className="link-button"
            onClick={onGoToRegister}
          >
            Criar conta
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;