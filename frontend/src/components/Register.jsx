// frontend/src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]  = useState('');
  const [phone, setPhone]        = useState('');
  const [email, setEmail]        = useState('');
  const [password, setPassword]  = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/register', {
        firstName,
        lastName,
        phone,
        email,
        password,
      });

      setSuccess('Conta criada com sucesso! Faça login.');
      // Redireciona para login após alguns segundos
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao criar conta. Verifique os dados.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>Criar Conta</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Seu nome"
          />
        </div>

        <div className="form-group">
          <label>Sobrenome</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Seu sobrenome"
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seuemail@exemplo.com"
          />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Crie uma senha"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Confirmar senha</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repita a senha"
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/login">Já tenho conta</Link>
      </div>
    </div>
  );
}

export default Register;