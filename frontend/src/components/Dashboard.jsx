// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function Dashboard() {
  const [circleId] = useState(localStorage.getItem('circleId'));
  const [month, setMonth] = useState(getCurrentMonth()); // YYYY-MM
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!circleId || !month) return;
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circleId, month]);

  async function loadSummary() {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/circles/${circleId}/summary`, {
        params: { ref_month: month },
      });
      const { totalIncome, totalExpense, balance } = res.data;
      setSummary({
        totalIncome,
        totalExpense,
        balance,
      });
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar resumo.');
    } finally {
      setLoading(false);
    }
  }

  const chartData = [
    {
      name: 'Receitas',
      valor: summary.totalIncome,
    },
    {
      name: 'Despesas',
      valor: summary.totalExpense,
    },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="month-selector">
          <label>Mês de referência:</label>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />
          <span>{getLabelForMonth(month)}</span>
        </div>
      </header>

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <section className="cards">
            <div className="card income-card">
              <h3>Receitas do mês</h3>
              <p className="value">
                R$ {summary.totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="card expense-card">
              <h3>Despesas do mês</h3>
              <p className="value">
                R$ {summary.totalExpense.toFixed(2)}
              </p>
            </div>
            <div className="card balance-card">
              <h3>Saldo do mês</h3>
              <p className={`value ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
                R$ {summary.balance.toFixed(2)}
              </p>
            </div>
          </section>

          <section className="chart-section">
            <h3>Comparativo Receitas x Despesas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                />
                <Bar dataKey="valor" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="notes">
            <p>
              Este é um resumo simples do mês selecionado, baseado nas
              transações que você cadastrou.
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function getCurrentMonth() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getLabelForMonth(m) {
  if (!m) return '';
  const [year, mon] = m.split('-');
  const date = new Date(Number(year), Number(mon) - 1, 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export default Dashboard;