// components/admin/TableOrdersModal.js (AJUSTADO para usar table_number)
'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Table, Spinner, Alert } from 'react-bootstrap';
import styles from './TableOrdersModal.module.css';

const TableOrdersModal = ({ show, handleClose, table }) => {
    const [latestActiveOrder, setLatestActiveOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiErrorDetails, setApiErrorDetails] = useState(''); // Para detalhes do erro da API

    const fetchLatestActiveOrderForTable = async (currentTable) => { // `currentTable` tem `id` e `table_number`
        setLoading(true);
        setError('');
        setApiErrorDetails('');
        setLatestActiveOrder(null);

        if (!currentTable || typeof currentTable.table_number === 'undefined') {
            setError('Informações da mesa incompletas para buscar pedidos.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/admin/orders`);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Falha ao analisar resposta de erro da API de pedidos.' }));
                const message = errorData.message || `Falha ao buscar pedidos. Status: ${res.status}`;
                setApiErrorDetails(message);
                throw new Error(message);
            }
            const allOrders = await res.json(); // API retorna objetos com `table_number`

            if (!Array.isArray(allOrders)) {
                const nonArrayMsg = 'Resposta da API de pedidos não é uma lista (array).';
                setApiErrorDetails(nonArrayMsg);
                throw new Error(nonArrayMsg);
            }

            const activeStatuses = ['pendente', 'em preparo', 'pronto']; // Status considerados ativos
            // Exemplo do retorno da API de pedidos fornecido pelo usuário:
            // { "id": 4, "table_number": 1, "status": "Pendente", "total": "158.00", ... }

            const tableSpecificActiveOrders = allOrders
                .filter(order => {
                    // Agora comparamos order.table_number com currentTable.table_number
                    return order.table_number === currentTable.table_number &&
                           order.status && // Garante que o status existe
                           activeStatuses.includes(order.status.toLowerCase());
                })
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Mais recente primeiro

            if (tableSpecificActiveOrders.length > 0) {
                setLatestActiveOrder(tableSpecificActiveOrders[0]);
            } else {
                if (!apiErrorDetails) {
                     setError(`Nenhum pedido ativo encontrado para a mesa ${currentTable?.table_number}.`);
                }
                // Se apiErrorDetails já estiver setado, ele será exibido.
            }
            console.log(`[DEBUG] TableOrdersModal - Mesa Nº: ${currentTable?.table_number}, Pedidos ativos filtrados: ${tableSpecificActiveOrders.length}, Último:`, tableSpecificActiveOrders[0]);

        } catch (err) {
            console.error(`Erro no TableOrdersModal para mesa ${currentTable?.table_number}:`, err);
            if (!apiErrorDetails) {
                setError(err.message || 'Ocorreu um erro ao buscar o pedido.');
            }
            // se apiErrorDetails já foi setado, ele terá prioridade na exibição.
            setLatestActiveOrder(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show && table) { // `table` é o objeto passado como prop
            fetchLatestActiveOrderForTable(table);
        } else if (!show) {
            setLatestActiveOrder(null);
            setError('');
            setApiErrorDetails('');
            setLoading(false);
        }
    }, [show, table]);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value || 0);

    const getStatusBadge = (status) => { //
        if (!status) return 'badge bg-dark';
        const normalized = status.toLowerCase();
        switch (normalized) {
            case 'pendente': return 'badge bg-secondary';
            case 'em preparo': return 'badge bg-warning text-dark';
            case 'pronto': return 'badge bg-info text-dark';
            case 'entregue': return 'badge bg-success';
            case 'cancelado': return 'badge bg-danger';
            default: return 'badge bg-dark';
        }
    };
    
    let modalContent;
    if (loading) {
        modalContent = (
            <div className="text-center p-3">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Carregando pedido...</p>
            </div>
        );
    } else if (apiErrorDetails) {
        modalContent = <Alert variant="danger">Erro da API: {apiErrorDetails}</Alert>;
    } else if (error) {
        modalContent = <Alert variant="info">{error}</Alert>;
    } else if (latestActiveOrder) {
        modalContent = (
            <Table striped bordered hover variant="dark" responsive>
                <thead>
                    <tr>
                        <th>Pedido ID</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Hora do Pedido</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{latestActiveOrder.id}</td>
                        <td>
                            <span className={getStatusBadge(latestActiveOrder.status)}>
                                {latestActiveOrder.status ? latestActiveOrder.status.charAt(0).toUpperCase() + latestActiveOrder.status.slice(1) : 'N/A'}
                            </span>
                        </td>
                        <td>{formatCurrency(latestActiveOrder.total)}</td>
                        <td>
                            {new Date(latestActiveOrder.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </td>
                    </tr>
                </tbody>
            </Table>
        );
    } else {
         modalContent = <Alert variant="info">Nenhum pedido ativo encontrado para esta mesa ou os dados não puderam ser carregados.</Alert>;
    }

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title>
                    Último Pedido Ativo da Mesa {table?.table_number || 'Desconhecida'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                {modalContent}
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TableOrdersModal;