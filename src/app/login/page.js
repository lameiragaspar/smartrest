'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';
import sharedStyles from '../adm/dashboard/Dashboard.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function LoginDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        router.push('/adm/dashboard');
      } else {
        setError(data.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch (err) {
      console.error('Erro de login:', err);
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`d-flex align-items-center justify-content-center vh-100 ${styles.loginBackground}`}>
      <div className={`card ${sharedStyles.cardDark} ${styles.loginCard}`}>
        <div className="card-body">
          <h3 className={`card-title text-center mb-4 ${sharedStyles.cardTitle}`}>
            <i className="bi bi-person-circle me-2"></i>
            Login Administrativo
          </h3>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className={`form-label ${styles.formLabel}`}>E-mail</label>
              <input
                type="email"
                className={`form-control ${styles.formInput}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className={`form-label ${styles.formLabel}`}>Senha</label>
              <input
                type="password"
                className={`form-control ${styles.formInput}`}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-100 ${styles.loginButton}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Entrando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>Entrar
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
