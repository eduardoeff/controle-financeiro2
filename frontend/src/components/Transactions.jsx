// src/components/Transactions.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TransactionForm from './TransactionForm';

function Transactions() {
  const [circleId] = useState(localStorage.getItem('circleId'));
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    month: '',
    type: '',
    category: '',
    personRole: '',
    status: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!circleId) return;
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circleId, filters]);

  async function loadTransactions() {
    try {
      const params = {};
      if (filters.month) params.ref_month = filters.month;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.personRole) params.person_role = filters.personRole;
      if (filters.status) params.status = filters.status;

      const res = await api.get(`/circles/${circleId}/transactions`, { params });
      setTransactions(res.data.items || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function handleClearFilters() {
    setFilters({
      month: '',
      type: '',
      category: '',
      personRole: '',
      status: ''
    });
  }

  function handleExportPDF() {
    window.print(); // MVP
  }

  async function handleSaved() {
    setShowForm(false);
    await loadTransactions();
  }

  return (
    <div className="transactions-container">
      <header className="transactions-header">
        <h2>Transações</h2>
        <div className="actions">
          <button
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            Nova Transação
          </button>
          <button
            className="btn-secondary"
            onClick={handleExportPDF}
          >
            Exportar para PDF
          </button>
        </div>
      </header>

      <section className="filters">
        <h3>Filtros</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>Mês</label>
            <input
              type="month"
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Pessoa</label>
            <select
              name="personRole"
              value={filters.personRole}
              onChange={handleFilterChange}
            >
              <option value="">Todas</option>
              <option value="Motorista">Motorista</option>
              <option value="Esposa">Esposa</option>
              <option value="Família">Família</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status (Despesa)</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="paid">Paga</option>
            </select>
          </div>
        </div>
        <button className="btn-secondary" onClick={handleClearFilters}>
          Limpar filtros
        </button>
      </section>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <TransactionForm
              circleId={circleId}
              onSaved={handleSaved}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <section className="transactions-list">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Dia</th>
              <th>Tipo</th>
              <th>Pessoa</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Valor (R$)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.weekDay}</td>
                <td>{tx.type === 'income' ? 'Receita' : 'Despesa'}</td>
                <td>{tx.personRole}</td>
                <td>{tx.category}</td>
                <td>{tx.description}</td>
                <td>{Number(tx.amount).toFixed(2)}</td>
                <td>
                  {tx.type === 'expense' ? (
                    tx.status === 'pending' ? 'Pendente' : 'Paga'
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan="8">Nenhuma transação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Transactions;