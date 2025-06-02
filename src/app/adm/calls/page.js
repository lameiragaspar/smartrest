'use client';

import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './Colls.module.css';
import sharedStyles from '../dashboard/Dashboard.module.css';

const CallsPage = () => {
    const [calls, setCalls] = useState([]);
    const [carregamento, setCarregamento] = useState(true);

    useEffect(() => {
        //let intervalId;

        async function fetchCalls() {
            setCarregamento(true);
            try {
                const res = await fetch('/api/admin/calls');
                const data = await res.json();
                setCalls(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Erro ao buscar chamados:', err);
                setCalls([]);
            } finally {
                setCarregamento(false);
            }
        }
        fetchCalls(); // Primeira chamada
        //intervalId = setInterval(fetchCalls, 5000); // Atualiza a cada 5 segundos

        //return () => clearInterval(intervalId); // Limpa ao desmontar
    }, []);


    const handleResolveCall = async (callId) => {
        try {
            const res = await fetch('/api/admin/calls', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: callId }),
            });

            if (!res.ok) {
                console.error('Falha ao atualizar chamado');
                return;
            }

            // Atualiza localmente
            setCalls(prevCalls =>
                prevCalls.map(call =>
                    call.id === callId ? { ...call, status: 'atendido' } : call
                )
            );
        } catch (err) {
            console.error('Erro ao marcar chamado como atendido:', err);
        }
    };


    const pendingCalls = calls.filter(call => call.status === 'pendente');
    const resolvedCalls = calls.filter(call => call.status === 'atendido');

    return (
        <div className="container-fluid">
            <h2 className={`mb-4 ${sharedStyles.pageTitle}`}>
                <i className="bi bi-bell-fill me-2"></i>Chamados das Mesas
            </h2>

            {carregamento ? (
                <div
                    className="d-flex flex-column justify-content-center align-items-center text-warning"
                    style={{ minHeight: '70vh' }}
                >
                    <Spinner animation="border" className="mb-2" />
                    <p className="mb-0">Carregando cardápio...</p>
                </div>
            ) : (
                <div className="row g-4">
                    {/* Chamados Pendentes */}
                    <div className="col-12 col-lg-6">
                        <div className={`card ${sharedStyles.cardDark}`}>
                            <div className="card-body">
                                <h5 className={`card-title ${sharedStyles.cardTitle}`}>
                                    Pendentes ({pendingCalls.length})
                                </h5>
                                <ul className={`list-group list-group-flush ${styles.callList}`}>
                                    {pendingCalls.length > 0 ? pendingCalls.map(call => (
                                        <li key={call.id} className={`list-group-item d-flex justify-content-between align-items-center ${sharedStyles.listItem} ${styles.pendingItem}`}>
                                            <div>
                                                <strong>Mesa {call.table}:</strong> {call.reason}
                                                <small className="d-block text-wharning">{call.time}</small>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleResolveCall(call.id)}
                                                title="Marcar como Resolvido"
                                            >
                                                <i className="bi bi-check-lg"></i>
                                            </button>
                                        </li>
                                    )) : (
                                        <li className={`${sharedStyles.listItem} text-center`}>Nenhum chamado pendente.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Chamados Resolvidos */}
                    <div className="col-12 col-lg-6">
                        <div className={`card ${sharedStyles.cardDark}`}>
                            <div className="card-body">
                                <h5 className={`card-title ${sharedStyles.cardTitle}`}>
                                    Resolvidos ({resolvedCalls.length})
                                </h5>
                                <ul className={`list-group list-group-flush ${styles.callList}`}>
                                    {resolvedCalls.length > 0 ? resolvedCalls.map(call => (
                                        <li key={call.id} className={`list-group-item ${sharedStyles.listItem} ${styles.resolvedItem}`}>
                                            <strong>Mesa {call.table}:</strong> {call.reason}
                                            <small className="d-block text-wharning">{call.time}</small>
                                        </li>
                                    )) : (
                                        <li className={`${sharedStyles.listItem} text-center`}>Nenhum chamado resolvido.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallsPage;