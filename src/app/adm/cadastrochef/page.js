'use client';

import { useState } from 'react';
import styles from './Register.module.css';
import sharedStyles from '../dashboard/Dashboard.module.css'; // Assumindo que este caminho está correto para seus estilos compartilhados

const RegisterChefPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        tel: '',
        email: '',
        password: '',
        confirmPassword: '',
        birth_date: '',
        notes: '',
        profession: 'chef',  // padrão válido
        status: 'ativo',      // padrão válido
    });

    const [photoFile, setPhotoFile] = useState(null); // Estado para o arquivo de foto
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    });
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const isPasswordStrong = (password) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasLetter && hasNumber && hasSpecialChar;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
        setSuccess('');
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setError('');
            setSuccess('');
        } else {
            setPhotoFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        setErrors({ password: '', confirmPassword: '' });

        let hasError = false;

        if (formData.password !== formData.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'As senhas não coincidem.' }));
            hasError = true;
        }

        if (!isPasswordStrong(formData.password)) {
            setErrors(prev => ({ ...prev, password: 'A senha deve conter pelo menos uma letra, um número e um caractere especial.' }));
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);

        const data = new FormData();
        // Adiciona os campos de texto
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'confirmPassword') { // Não enviar confirmPassword para o servidor
                data.append(key, value);
            }
        });

        // Adiciona a imagem, se houver
        if (photoFile) {
            data.append('photo', photoFile);
        }

        try {
            const res = await fetch('/api/admin/register', {
                method: 'POST',
                body: data,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Falha ao cadastrar usuário.');
            }

            const result = await res.json();
            setSuccess(result.message || 'Usuário cadastrado com sucesso!');

            setFormData({
                name: '',
                tel: '',
                email: '',
                password: '',
                confirmPassword: '',
                birth_date: '',
                notes: '',
                profession: '',
                status: '',
            });
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'confirmPassword' && value !== '') {
                    data.append(key, value);
                }
            });


            setPhotoFile(null);
            e.target.reset(); // Limpa inputs incluindo o input[type="file"]
        } catch (err) {
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container-fluid">
            <h2 className={`mb-4 ${sharedStyles.pageTitle}`}>
                <i className="bi bi-person-plus-fill me-2"></i>Cadastrar Novo Usuário
            </h2>

            <div className={`card ${sharedStyles.cardDark} ${styles.formCard}`}>
                <div className="card-body">
                    <h5 className={`card-title ${sharedStyles.cardTitle}`}>Dados do Trabalhador</h5>

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
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control ${styles.formInput} ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                                <div className="input-group">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`form-control ${styles.formInput} ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="tel" className="form-label">Telefone</label>
                                <input
                                    type="tel"
                                    className={`form-control ${styles.formInput}`}
                                    id="tel"
                                    name="tel"
                                    value={formData.tel}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="birth_date" className="form-label">Data de Nascimento</label>
                                <input
                                    type="date"
                                    className={`form-control ${styles.formInput}`}
                                    id="birth_date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="photo" className="form-label">Foto de Perfil</label>
                            <input
                                type="file"
                                className={`form-control ${styles.formInputFile}`} /* Novo estilo para input file */
                                id="photo"
                                name="photo"
                                accept="image/*" // Aceita apenas arquivos de imagem
                                onChange={handlePhotoChange}
                            />
                            {photoFile && <small className="text-white mt-2 d-block">Arquivo selecionado: {photoFile.name}</small>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notes" className="form-label">Notas</label>
                            <textarea
                                className={`form-control ${styles.formInput}`}
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="profession" className="form-label">Profissão</label>
                                <select
                                    className={`form-select ${styles.formInput}`}
                                    id="profession"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    required
                                //disabled // Profissão fixa para 'chef' nesta página
                                >
                                    <option value="chef">Chef</option>
                                    <option value="cozinheiro">Cozinheiro(a)</option>
                                    <option value="garcon">Garçom</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    className={`form-select ${styles.formInput}`}
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                    <option value="suspenso">Suspenso</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Cadastrando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle-fill me-2"></i>Cadastrar funcionário
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