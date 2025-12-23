// frontend/src/components/TopBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function TopBar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserName();
  }, []);

  async function loadUserName() {
    try {
      const res = await api.get('/auth/me');
      // tenta usar firstName; se não tiver, usa email
      setUserName(res.data.firstName || res.data.email);
    } catch (err) {
      console.error(err);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('circleId');
    navigate('/login');
  }

  return (
    <div className="topbar">
      <h1>💰 Controle Financeiro</h1>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transações</Link>
      </nav>

      <div className="topbar-user">
        {userName && <span className="user-name">Olá, {userName}!</span>}
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
}

export default TopBar;