'use client';// components/admin/OrderStatusModal.js
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// import styles from './OrderDetailsModal.module.css'; // Removido se não usado, ou crie/use styles específicos

const OrderStatusModal = ({ show, handleClose, order, onSaveStatus }) => {
    const [newStatus, setNewStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // Para exibir erros da API

    // Lista de status possíveis, conforme ENUM do banco de dados
    const statuses = ['pendente', 'em preparo', 'pronto', 'entregue'];

    // Atualiza o newStatus quando o 'order' prop mudar (quando um novo pedido é selecionado)
    useEffect(() => {
        if (order) {
            setNewStatus(order.status || ''); // Define o status atual do pedido
            setError(''); // Limpa erros anteriores
        }
    }, [order]);


    const handleSave = async () => {
        setLoading(true);
        setError(''); // Limpa erro antes de tentar salvar
        try {
            await onSaveStatus(order.id, newStatus);
            handleClose(); // Fecha o modal em caso de sucesso
        } catch (err) {
            console.error("Erro ao salvar status:", err);
            setError(err.message || "Falha ao atualizar o status. Tente novamente.");
            // Não fecha o modal em caso de erro, para que o usuário veja a mensagem
        } finally {
            setLoading(false);
        }
    };
    
    // Capitaliza a primeira letra para exibição
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton style={{backgroundColor: '#1f1f1f', color: '#ffc107', borderBottom: '1px solid #444'}}>
                <Modal.Title>Alterar Status do Pedido #{order?.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: '#333', color: '#fff'}}>
                {/* A API agora retorna 'table_number' no objeto 'order' */}
                <p>Mesa: <strong>{order?.table_number}</strong></p>
                <p>Status Atual: <strong>{capitalizeFirstLetter(order?.status)}</strong></p>
                
                {error && <div className="alert alert-danger">{error}</div>}

                <Form.Group controlId="formOrderStatus">
                    <Form.Label>Novo Status</Form.Label>
                    <Form.Select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        style={{backgroundColor: '#444', color: '#fff', border: '1px solid #555'}}
                        disabled={loading} // Desabilita enquanto salva
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>
                                {capitalizeFirstLetter(status)}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: '#1f1f1f', borderTop: '1px solid #444'}}>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={loading || newStatus === order?.status}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderStatusModal;