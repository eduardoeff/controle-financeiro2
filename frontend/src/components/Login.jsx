// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault(); // impede recarregar página

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      // desestrutura o token da resposta
      const { token } = response.data;

      // Salva token e circleId (mock temporário)
      localStorage.setItem('token', token);
      localStorage.setItem('circleId', '1'); // MOCK temporário

      // redireciona para dashboard (apenas uma vez)
      navigate('/dashboard');
    } catch (err) {
      console.error('ERRO NO LOGIN:', err?.response?.data || err.message);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao fazer login. Verifique seus dados.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
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
              placeholder="Sua senha"
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

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/forgot-password">Esqueci a senha</Link>
        <Link to="/register">Criar nova conta</Link>
      </div>
    </div>
  );
}

export default Login;