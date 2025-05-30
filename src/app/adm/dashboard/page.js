'use client';

import { useEffect, useState } from 'react';
import SummaryCard from '@/components/dashboard/SummaryCard';
import styles from './Dashboard.module.css';

// Componente Principal da Página
export default function DashboardPage() {
    const [summary, setSummary] = useState(null);
    const [orders, setOrders] = useState([]);
    const [calls, setCalls] = useState([]);

    const [loadingSummary, setLoadingSummary] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingCalls, setLoadingCalls] = useState(true);

    // Carrega Resumo
    useEffect(() => {
        async function fetchSummary() {
            try {
                const res = await fetch('/api/admin/sumary');
                const data = await res.json();
                setSummary(data ?? {});
            } catch (err) {
                //console.error('Erro ao buscar resumo:', err);
                setSummary({});
            } finally {
                setLoadingSummary(false);
            }
        }
        fetchSummary();
    }, []);

    // Carrega Pedidos
    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch('/api/admin/orders');
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                //console.error('Erro ao buscar pedidos:', err);
                setOrders([]);
            } finally {
                setLoadingOrders(false);
            }
        }
        fetchOrders();
    }, []);

    // Carrega Chamados
    useEffect(() => {
        async function fetchCalls() {
            try {
                const res = await fetch('/api/admin/call');
                const data = await res.json();
                setCalls(Array.isArray(data) ? data : []);
            } catch (err) {
                //console.error('Erro ao buscar chamados:', err);
                setCalls([]);
            } finally {
                setLoadingCalls(false);
            }
        }
        fetchCalls();
    }, []);

    return (
        <div className="container-fluid">
            <h2 className={`mb-4 ${styles.pageTitle}`}>Visão Geral do Restaurante</h2>

            {/* Linha dos Summary Cards */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-sm-6 col-lg-3">
                    <SummaryCard
                        title="Pedidos Ativos"
                        value={loadingSummary ? '...' : summary?.activeOrders}
                        link="/adm/orders"
                        icon={<i className="bi bi-basket-fill fs-1"></i>}
                    />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <SummaryCard
                        title="Mesas Ocupadas"
                        value={loadingSummary ? '...' : summary?.occupiedTables}
                        link="/adm/tables"
                        icon={<i className="bi bi-people-fill fs-1"></i>}
                    />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <SummaryCard
                        title="Chamados Pendentes"
                        value={loadingSummary ? '...' : summary?.pendingCalls}
                        link="/adm/calls"
                        icon={<i className="bi bi-bell-fill fs-1"></i>}
                        bgColor="#5a3e00"
                    />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <SummaryCard
                        title="Mesas Livres"
                        value={loadingSummary ? '...' : summary?.availableTables}
                        link="/adm/tables"
                        icon={<i className="bi bi-door-open-fill fs-1"></i>}
                        bgColor="#444"
                    />
                </div>
            </div>

            {/* Linha das Tabelas/Listas */}
            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <div className={`card ${styles.cardDark}`}>
                        <div className="card-body">
                            <h5 className={`card-title ${styles.cardTitle}`}>Últimos Pedidos Entregues</h5>
                            {loadingOrders ? (
                                <p>Carregando pedidos...</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className={`table table-dark table-hover ${styles.dataTable}`}>
                                        <thead>
                                            <tr>
                                                <th scope="col">Pedido ID</th>
                                                <th scope="col">Mesa</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Total (Kz)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{order.table}</td>
                                                    <td>
                                                        <span className="badge bg-success">{order.status}</span>
                                                    </td>
                                                    <td>{Number(order.total).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <div className={`card ${styles.cardDark}`}>
                        <div className="card-body">
                            <h5 className={`card-title ${styles.cardTitle}`}>Chamados Pendentes ({calls.length})</h5>
                            {loadingCalls ? (
                                <p>Carregando chamados...</p>
                            ) : calls.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {calls.map(call => (
                                        <li key={call.id} className={`list-group-item ${styles.listItem}`}>
                                            <div className="d-flex justify-content-between">
                                                <span>
                                                    <strong>Mesa {call.table}:</strong> {call.reason}
                                                </span>
                                                <small className="text-muted">{call.time}</small>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.noData}>Nenhum chamado pendente.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
