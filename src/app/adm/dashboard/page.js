'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [feedback, setFeedback] = useState('');

  const cadastrarCozinheiro = async (e) => {
    e.preventDefault();
    setFeedback('');

    try {
      const res = await fetch('/api/admin/cozinheiros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback('✅ Cozinheiro cadastrado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
      } else {
        setFeedback(data.message || 'Erro ao cadastrar cozinheiro');
      }
    } catch (error) {
      console.error(error);
      setFeedback('Erro interno ao cadastrar');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-warning mb-4">Painel Administrativo</h2>

      <div className="card mx-auto" style={{ maxWidth: 500 }}>
        <div className="card-body">
          <h5 className="card-title">Cadastrar Cozinheiro</h5>
          {feedback && <div className="alert alert-info">{feedback}</div>}
          <form onSubmit={cadastrarCozinheiro}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input type="password" className="form-control" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <button className="btn btn-success w-100">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
