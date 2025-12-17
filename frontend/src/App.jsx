// src/App.jsx
import React, { useState } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import Transactions from './components/Transactions.jsx';

function App() {
  const [page, setPage] = useState('login'); // login | register | dashboard | transactions

  function handleLoggedIn() {
    setPage('dashboard');
  }

  function handleLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('circleId');
    setPage('login');
  }

  function renderPage() {
    if (!localStorage.getItem('token') && page !== 'register') {
      return (
        <Login
          onLogin={handleLoggedIn}
          onGoToRegister={() => setPage('register')}
          onGoToForgotPassword={() => alert('Funcionalidade de recuperar senha ainda não implementada.')}
        />
      );
    }

    switch (page) {
      case 'register':
        return <Register onRegistered={handleLoggedIn} />;
      case 'dashboard':
        return (
          <>
            <TopBar onLogout={handleLoggedOut} onGo={setPage} />
            <Dashboard />
          </>
        );
      case 'transactions':
        return (
          <>
            <TopBar onLogout={handleLoggedOut} onGo={setPage} />
            <Transactions />
          </>
        );
      default:
        return (
          <Login
            onLogin={handleLoggedIn}
            onGoToRegister={() => setPage('register')}
            onGoToForgotPassword={() => alert('Funcionalidade de recuperar senha ainda não implementada.')}
          />
        );
    }
  }

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  );
}

function TopBar({ onLogout, onGo }) {
  const userName = localStorage.getItem('userName') || 'Usuário';
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>Controle Financeiro</h1>
      </div>
      <div className="topbar-center">
        <button onClick={() => onGo('dashboard')} className="link-button">
          Dashboard
        </button>
        <button onClick={() => onGo('transactions')} className="link-button">
          Transações
        </button>
      </div>
      <div className="topbar-right">
        <span>{userName}</span>
        <button onClick={onLogout} className="btn-secondary">
          Sair
        </button>
      </div>
    </header>
  );
}

export default App;