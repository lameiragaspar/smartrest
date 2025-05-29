'use client';

import { useState } from 'react';
import styles from './Register.module.css';
import sharedStyles from '../dashboard/Dashboard.module.css';

const RegisterChefPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem!');
            return;
        }

        setLoading(true);
        try {
            // Lógica para enviar dados para a API
            // const res = await fetch('/api/admin/users/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ ...formData, role: 'Chef' }),
            // });
            // if (!res.ok) throw new Error('Falha ao cadastrar Chef.');
            // const data = await res.json();

            console.log('Dados para enviar:', { ...formData, role: 'Chef' }); // Simulação
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay da API

            setSuccess('Chef cadastrado com sucesso!');
            setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // Limpa o form

        } catch (err) {
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container-fluid">
            <h2 className={`mb-4 ${sharedStyles.pageTitle}`}>
                <i className="bi bi-person-plus-fill me-2"></i>Cadastrar Novo Chef
            </h2>

            <div className={`card ${sharedStyles.cardDark} ${styles.formCard}`}>
                <div className="card-body">
                    <h5 className={`card-title ${sharedStyles.cardTitle}`}>Dados do Chef</h5>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nome Completo</label>
                            <input
                                type="text"
                                className={`form-control ${styles.formInput}`}
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Endereço de Email</label>
                            <input
                                type="email"
                                className={`form-control ${styles.formInput}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="row">
                             <div className="col-md-6 mb-3">
                                <label htmlFor="password" className="form-label">Senha</label>
                                <input
                                    type="password"
                                    className={`form-control ${styles.formInput}`}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                             <div className="col-md-6 mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                                <input
                                    type="password"
                                    className={`form-control ${styles.formInput}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Cadastrando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle-fill me-2"></i>Cadastrar Chef
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterChefPage;