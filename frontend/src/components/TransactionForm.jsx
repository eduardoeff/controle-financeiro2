// C:\Projetos\controle-financeiro\frontend\src\components\TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TransactionForm({ circleId, onSaved, onCancel, transaction }) { // Recebe 'transaction'
  const [date, setDate] = useState('');
  const [weekDay, setWeekDay] = useState('');
  const [type, setType] = useState('income');
  const [personRole, setPersonRole] = useState('Motorista');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState('paid');
  const [isFixed, setIsFixed] = useState(false);
  const [error, setError] = useState('');

  // Preenche o formulário se uma transação for passada para edição
  useEffect(() => {
    if (transaction) {
      setDate(transaction.date);
      setType(transaction.type);
      setPersonRole(transaction.personRole);
      setCategory(transaction.category);
      setAmount(transaction.amount);
      setDescription(transaction.description || '');
      setPaymentMethod(transaction.paymentMethod || '');
      setStatus(transaction.status || 'paid');
      setIsFixed(transaction.isFixed);
    } else {
      // Limpa o formulário para nova transação
      setDate('');
      setType('income');
      setPersonRole('Motorista');
      setCategory('');
      setAmount('');
      setDescription('');
      setPaymentMethod('');
      setStatus('paid');
      setIsFixed(false);
    }
  }, [transaction]); // Depende da transação para edição

  useEffect(() => {
    if (date) {
      const d = new Date(date + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
      const opts = { weekday: 'long' };
      const wd = d.toLocaleDateString('pt-BR', opts);
      setWeekDay(wd.charAt(0).toUpperCase() + wd.slice(1));
    } else {
      setWeekDay('');
    }
  }, [date]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!date || !type || !category || !amount) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const numericAmount = Number(amount.toString().replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Valor inválido.');
      return;
    }

    try {
      const payload = {
        date,
        type,
        personRole,
        category,
        amount: numericAmount,
        description,
        paymentMethod,
        status,
        isFixed
      };

      if (transaction) {
        // Se estiver editando, usa PUT
        await api.put(`/circles/${circleId}/transactions/${transaction.id}`, payload);
      } else {
        // Se for nova transação, usa POST
        await api.post(`/circles/${circleId}/transactions`, payload);
      }

      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar transação.');
    }
  }

  return (
    <div className="transaction-form">
      <h3>{transaction ? 'Editar transação' : 'Nova transação'}</h3> {/* Título dinâmico */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Data*</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
          {weekDay && <small>Dia da semana: {weekDay}</small>}
        </div>

        <div className="form-group">
          <label>Tipo*</label>
          <select value={type} onChange={e => setType(e.target.value)} required>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>

        <div className="form-group">
          <label>Pessoa*</label>
          <select
            value={personRole}
            onChange={e => setPersonRole(e.target.value)}
            required
          >
            <option value="Motorista">Motorista</option>
            <option value="Esposa">Esposa</option>
            <option value="Família">Família</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div className="form-group">
          <label>Categoria*</label>
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="Ex: Corridas, Combustível, Mercado..."
            required
          />
        </div>

        <div className="form-group">
          <label>Valor (R$)*</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição (opcional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Detalhes da transação"
          />
        </div>

        <div className="form-group">
          <label>Método de pagamento (opcional)</label>
          <input
            type="text"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            placeholder="Dinheiro, Pix, Cartão..."
          />
        </div>

        {type === 'expense' && (
          <div className="form-group">
            <label>Status da despesa*</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="pending">Pendente</option>
              <option value="paid">Paga</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isFixed}
              onChange={e => setIsFixed(e.target.checked)}
            />{' '}
            Conta fixa?
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {transaction ? 'Salvar alterações' : 'Salvar'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;