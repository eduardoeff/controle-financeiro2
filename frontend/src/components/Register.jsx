// src/components/Register.jsx
import React, { useState } from 'react';
import api from '../services/api';

function Register({ onRegistered, prefilledEmail }) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('As senhas não conferem.');
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        name,
        lastName,
        phone,
        email,
        password
      });

      const { token, user, circle } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userId', user.id);
      if (circle) {
        localStorage.setItem('circleId', circle.id);
      }

      if (onRegistered) onRegistered();
    } catch (err) {
      console.error(err);
      setError('Erro ao criar conta. Verifique os dados ou tente outro email.');
    }
  }

  return (
    <div className="auth-container">
      <h2>Criar conta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome*</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Sobrenome*</label>
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefone (opcional)</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={!!prefilledEmail}
          />
        </div>

        <div className="form-group">
          <label>Senha*</label>
          <div className="password-wrapper">
            <input
              type={showPass ? 'text' : 'password'}
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

        <div className="form-group">
          <label>Confirmar senha*</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPass ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPass(p => !p)}
            >
              {showConfirmPass ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary">
          Criar conta
        </button>
      </form>
    </div>
  );
}

export default Register;