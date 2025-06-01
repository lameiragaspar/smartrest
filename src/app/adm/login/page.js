'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css'; // Importe o CSS module para esta página
import sharedStyles from '../dashboard/Dashboard.module.css'; // Para estilos compartilhados como cardDark

export default function LoginDashboard() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Renomeado para 'password' para consistência
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Adicionado estado de loading

    const handleLogin = async (e) => { // Renomeado para handleLogin para clareza
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) // Usando 'password'
            });

            const data = await res.json();

            if (res.ok && data.token) {
                // Armazenar o token de forma mais segura (ex: cookies HTTP-only) é recomendado para produção.
                // Para este exemplo, manteremos localStorage como solicitado, mas esteja ciente.
                localStorage.setItem('token', data.token);
                router.push('/dashboard');
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
                        <i className="bi bi-person-circle me-2"></i>Login Administrativo
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

                        <div className="mb-4"> {/* Aumento o mb para espaçar do botão */}
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

                        <button type="submit" className={`btn btn-primary w-100 ${styles.loginButton}`} disabled={loading}>
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