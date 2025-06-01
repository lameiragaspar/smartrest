// components/admin/TableStatusModal.js
'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import styles from './TableStatusModal.module.css'; // Crie este arquivo CSS

const TableStatusModal = ({ show, handleClose, table, onSaveStatus, actionLoading }) => {
    const [newStatus, setNewStatus] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (table && show) {
            setNewStatus(table.status); // Inicializa com o status atual da mesa
            setError('');
        }
    }, [table, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!newStatus) {
            setError('Por favor, selecione um novo status para a mesa.');
            return;
        }
        try {
            await onSaveStatus(table.id, newStatus);
            // O handleClose será chamado pelo componente pai após o sucesso
        } catch (err) {
            // Exibe o erro vindo da função onSaveStatus (que vem da API)
            setError(err.message || 'Falha ao salvar o status da mesa.');
        }
    };

    const statusOptions = [
        { value: 'livre', label: 'Livre' },
        { value: 'ocupado', label: 'Ocupada' },
        { value: 'reservado', label: 'Reservada' },
        { value: 'usado', label: 'Necessita Limpeza' },
    ];

    return (
        <Modal show={show} onHide={() => { setError(''); handleClose(); }} centered>
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title>Alterar Status da Mesa {table?.table_number}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className={styles.modalBody}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group controlId="tableStatusSelect">
                        <Form.Label>Novo Status da Mesa:</Form.Label>
                        <Form.Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            required
                            className={styles.formSelectDark} // Estilo customizado para tema escuro
                        >
                            <option value="" disabled>Selecione um status...</option>
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button variant="secondary" onClick={() => { setError(''); handleClose(); }} disabled={actionLoading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={actionLoading}>
                        {actionLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                {' Salvando...'}
                            </>
                        ) : (
                            'Salvar Alterações'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default TableStatusModal;