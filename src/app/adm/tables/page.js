// page - Cópia.js (Assumindo que este é o seu TablesPage.js)
'use client';

import { useEffect, useState } from 'react';
import styles from './Tables.module.css'; // Seu CSS module para TablesPage
import sharedStyles from '../dashboard/Dashboard.module.css'; // Estilos compartilhados do Dashboard
import TableOrdersModal from './TableOrdersModal'; // Modal de pedidos da mesa (será ajustado na Parte 4)
import TableStatusModal from './tableStatusModal';// Modal para alterar status da MESA

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [pageLoading, setPageLoading] = useState(true); // Loading da página
  const [actionLoading, setActionLoading] = useState(false); // Loading para ações (salvar status, etc.)

  // Estados para o modal de PEDIDOS da mesa
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedTableForOrders, setSelectedTableForOrders] = useState(null);

  // Estados para o modal de STATUS da mesa
  const [showTableStatusModal, setShowTableStatusModal] = useState(false);
  const [selectedTableForStatus, setSelectedTableForStatus] = useState(null);

  const fetchTables = async () => {
    setPageLoading(true);
    try {
      const res = await fetch('/api/admin/tables'); // API que você forneceu
      if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Falha ao analisar resposta de erro da API de mesas' }));
          throw new Error(errorData.message || `Falha ao buscar mesas: ${res.statusText}`);
      }
      const data = await res.json(); // API retorna t.id, t.table_number, t.status, t.people_count AS capacity, COUNT(*) AS orders
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar mesas:', err);
      alert(`Erro ao buscar mesas: ${err.message}`);
      setTables([]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const traduzirStatusMesa = {
    livre: 'LIVRE',
    ocupado: 'OCUPADA',
    reservado: 'RESERVADA',
    usado: 'NECESSITA LIMPEZA',
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'livre': return styles.tableFree;
      case 'ocupado': return styles.tableOccupied;
      case 'reservado': return styles.tableReserved;
      case 'usado': return styles.tableCleaning;
      default: return '';
    }
  };

  // --- Funções para MODAL DE PEDIDOS DA MESA ---
  const handleOpenOrdersModal = (table) => {
    setSelectedTableForOrders(table); // `table` aqui contém `id`, `table_number`, etc. da API de mesas
    setShowOrdersModal(true);
  };
  const handleCloseOrdersModal = () => {
    setShowOrdersModal(false);
    setSelectedTableForOrders(null);
  };

  // --- Funções para MODAL DE STATUS DA MESA ---
  const handleOpenTableStatusModal = (table) => {
    setSelectedTableForStatus(table);
    setShowTableStatusModal(true);
  };
  const handleCloseTableStatusModal = () => {
    setShowTableStatusModal(false);
    setSelectedTableForStatus(null);
    setActionLoading(false); // Reseta o loading da ação
  };

  const handleSaveTableStatus = async (tableId, newStatus) => {
    setActionLoading(true);
    try {
        const res = await fetch(`/api/admin/table-status`, { // API criada na Parte 1
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableId, newStatus }),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Falha ao analisar resposta de erro da API.' }));
            throw new Error(errorData.message || 'Falha ao atualizar status da mesa.');
        }
        await fetchTables(); // Rebusca as mesas para refletir a mudança
        handleCloseTableStatusModal(); // Fecha o modal de status
        // Opcional: adicionar um toast/alert de sucesso aqui
    } catch (err) {
        console.error('Erro ao salvar status da mesa:', err);
        // O erro será lançado para o TableStatusModal poder exibi-lo em seu Alert.
        throw err;
    }
    // `finally` não é necessário aqui pois o actionLoading é resetado no handleClose ou no sucesso/erro dentro do modal.
  };

  return (
    <div className="container-fluid">
      <h2 className={`mb-4 ${sharedStyles.pageTitle}`}>
        <i className="bi bi-grid-3x3-gap-fill me-2"></i>Gerenciamento de Mesas
      </h2>

      {pageLoading ? (
         <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando mesas...</span>
            </div>
            <p className="mt-2">Carregando mesas...</p>
        </div>
      ) : tables.length === 0 ? (
        <div className="alert alert-info" role="alert">
            Nenhuma mesa cadastrada ou encontrada.
        </div>
      ) : (
        <div className="row g-4">
          {tables.map(table => ( // `table` aqui é o objeto da API /api/admin/tables
            <div key={table.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className={`card h-100 ${sharedStyles.cardDark} ${styles.tableCard} ${getStatusStyle(table.status)}`}>
                <div className="card-body text-center d-flex flex-column">
                  <div className={styles.tableNumberDisplay}>{table.table_number}</div>
                  <div className={styles.tableStatus}>
                    {traduzirStatusMesa[table.status] || table.status.toUpperCase()}
                  </div>
                  <div className="mt-auto">
                    <p className="mb-1">
                      <i className="bi bi-people-fill me-1"></i> {table.capacity} Lugares {/* capacity vem como people_count da API */}
                    </p>
                    <p className="mb-3">
                      <i className="bi bi-receipt me-1"></i> {table.orders} Pedido(s) Ativo(s) {/* orders é a contagem da API */}
                    </p>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleOpenOrdersModal(table)}
                        disabled={table.orders === 0} // Desabilita se não houver pedidos ativos
                      >
                        Ver Pedido Ativo
                      </button>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => handleOpenTableStatusModal(table)} // Chama o modal de status da mesa
                      >
                        Alterar Status Mesa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para exibir o ÚLTIMO PEDIDO ATIVO da mesa */}
      {selectedTableForOrders && (
        <TableOrdersModal
          show={showOrdersModal}
          handleClose={handleCloseOrdersModal}
          table={selectedTableForOrders} // Passa o objeto `table` que contém `id` e `table_number`
        />
      )}

      {/* Modal para ALTERAR STATUS da MESA */}
      {selectedTableForStatus && (
        <TableStatusModal
          show={showTableStatusModal}
          handleClose={handleCloseTableStatusModal}
          table={selectedTableForStatus}
          onSaveStatus={handleSaveTableStatus}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default TablesPage;