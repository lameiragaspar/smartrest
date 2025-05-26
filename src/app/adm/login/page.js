'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const login = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setErro(data.message || 'Credenciais inválidas');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro no login');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark">
      <form onSubmit={login} className="p-4 bg-light rounded shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h3 className="text-center mb-4">Login Administrativo</h3>

        {erro && <div className="alert alert-danger">{erro}</div>}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Entrar
        </button>
      </form>
    </div>
  );
}