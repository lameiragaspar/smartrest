'use client';

import { useEffect, useState } from 'react';
import styles from './Orders.module.css';
import sharedStyles from '../dashboard/Dashboard.module.css';
import OrderStatusModal from './OrderStatusModal';
import OrderDetailsModal from './OrderDetailsModal';
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Importar o novo modal

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Loading da tabela principal
    const [actionLoading, setActionLoading] = useState(false); // Loading para ações (delete, update status)
    const [filter, setFilter] = useState('Todos');

    const [showDetails, setShowDetails] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Estados para o modal de exclusão
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);


    const fetchOrders = async () => {
        setLoading(true);
        //console.log(`[DEBUG] Fetching orders with filter: ${filter}`);
        try {
            const res = await fetch(`/api/admin/orders`);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Falha ao analisar resposta de erro' }));
                throw new Error(errorData.message || `Falha ao buscar pedidos: ${res.statusText}`);
            }
            const data = await res.json();
            console.log("[DEBUG] Data received from API for orders list:", data);
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
            alert(`Erro ao buscar pedidos: ${err.message}`);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        //console.log(`[DEBUG] Filter changed to: ${filter}. Refetching orders.`);
        fetchOrders();
    }, [filter]);

    const getStatusBadge = (status) => {
        const normalized = status.toLowerCase();
        switch (normalized) {
            case 'pendente':
                return 'badge bg-secondary'; // cinza
            case 'em preparo':
                return 'badge bg-warning text-dark'; // amarelo
            case 'pronto':
                return 'badge bg-info text-dark'; // azul claro
            case 'entregue':
                return 'badge bg-success'; // verde
            case 'cancelado':
                return 'badge bg-danger'; // vermelho
            default:
                return 'badge bg-dark'; // fallback
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    const handleChangeStatus = (order) => {
        setSelectedOrder(order);
        setShowStatus(true);
    };

    const handleSaveStatus = async (orderId, newStatus) => {
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/orderStatus?id=${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Falha ao analisar resposta de erro' }));
                throw new Error(errorData.message || 'Falha ao atualizar status.');
            }
            fetchOrders();
            // O modal de status já tem seu próprio setError e pode fechar-se
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    // Abre o modal de confirmação de exclusão
    const initiateDeleteOrder = (order) => {
        setOrderToDelete(order);
        setShowDeleteModal(true);
    };

    // Executa a exclusão após confirmação no modal
    const executeDeleteOrder = async () => {
        if (!orderToDelete) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/orders?id=${orderToDelete.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Falha ao analisar resposta de erro' }));
                throw new Error(errorData.message || 'Falha ao cancelar o pedido.');
            }
            fetchOrders();
            alert('Pedido cancelado com sucesso.'); // Pode substituir por um toast/notificação
        } catch (err) {
            console.error(err);
            alert(`Erro ao cancelar pedido: ${err.message}`);
        } finally {
            setActionLoading(false);
            setShowDeleteModal(false);
            setOrderToDelete(null);
        }
    };

    const filterButtons = [
        { label: 'Todos', value: 'Todos' },
        { label: 'Pendentes', value: 'pendente' },
        { label: 'Em Preparo', value: 'em preparo' },
        { label: 'Prontos', value: 'pronto' },
        { label: 'Entregues', value: 'entregue' },
    ];
    const filteredOrders = orders.filter(order => {
        if (filter === 'Todos') return true;
        return order.status.toLowerCase() === filter.toLowerCase();
    });

    return (
        <div className="container-fluid">
            <h2 className={`mb-4 ${sharedStyles.pageTitle}`}>
                <i className="bi bi-receipt-cutoff me-2"></i>Gerenciamento de Pedidos
            </h2>

            <div className={`card mb-4 ${sharedStyles.cardDark}`}>
                <div className="card-body d-flex gap-2 flex-wrap">
                    {filterButtons.map(btn => (
                        <button
                            key={btn.value}
                            className={`btn ${filter === btn.value ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter(btn.value)}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`card ${sharedStyles.cardDark}`}>
                <div className="card-body">
                    <h5 className={`card-title ${sharedStyles.cardTitle}`}>Pedidos ({filter})</h5>
                    {loading ? (
                        <div className="text-center p-5">
                            {/* ... spinner ... */}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className={`table table-dark table-hover ${sharedStyles.dataTable}`}>
                                <thead>
                                    <tr>
                                        <th scope="col">Pedido ID</th>
                                        <th scope="col">Mesa</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Total (Kz)</th>
                                        <th scope="col">Hpra</th>
                                        <th scope="col">Opções</th>
                                    </tr>
                                </thead>
                                <tbody>{filteredOrders.map(order => (
                                    <tr key={order.id} className={styles.orderRow}>
                                        <td>{order.id}</td>
                                        <td>{order.table_number}</td>
                                        <td>
                                            <span className={getStatusBadge(order.status)}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            {new Intl.NumberFormat('pt-AO', {
                                                style: 'currency',
                                                currency: 'AOA'
                                            }).format(order.total || 0)}
                                        </td>
                                        <td>
                                            {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-light me-2"
                                                title="Ver Detalhes"
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                <i className="bi bi-eye-fill"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-warning me-2"
                                                title="Alterar Status"
                                                onClick={() => handleChangeStatus(order)}
                                            >
                                                <i className="bi bi-pencil-fill"></i>
                                            </button>
                                            {/*<button
                                                className="btn btn-sm btn-outline-danger"
                                                title="Cancelar Pedido"
                                                onClick={() => initiateDeleteOrder(order)}
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </button>*/}
                                        </td>
                                    </tr>
                                ))}
                                    {filteredOrders.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                Nenhum pedido encontrado para o filtro "{filter}".
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {selectedOrder && (
                <>
                    <OrderDetailsModal
                        show={showDetails}
                        handleClose={() => { setShowDetails(false); setSelectedOrder(null); }}
                        orderId={selectedOrder.id}
                    />
                    <OrderStatusModal
                        show={showStatus}
                        handleClose={() => { setShowStatus(false); setSelectedOrder(null); }}
                        order={selectedOrder}
                        onSaveStatus={handleSaveStatus}
                    // Passar actionLoading para o modal de status se ele precisar desabilitar botões
                    // loading={actionLoading} 
                    />
                </>
            )}

            {orderToDelete && (
                <ConfirmDeleteModal
                    show={showDeleteModal}
                    handleClose={() => { setShowDeleteModal(false); setOrderToDelete(null); }}
                    handleConfirm={executeDeleteOrder}
                    itemName={orderToDelete.id}
                    loading={actionLoading}
                />
            )}
        </div>
    );
};

export default OrdersPage;