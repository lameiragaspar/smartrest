'use client';

import { useEffect, useState } from 'react';
import styles from './Tables.module.css';
import sharedStyles from '../dashboard/Dashboard.module.css';

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTables() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/tables');
        const data = await res.json();
        setTables(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar mesas:', err);
        setTables([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTables();
  }, []);

  const traduzirStatus = {
    available: 'Livre',
    occupied: 'Ocupada',
    reserved: 'Reservada',
    cleaning: 'Necessita Limpeza',
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'available': return styles.tableFree;
      case 'occupied': return styles.tableOccupied;
      case 'reserved': return styles.tableReserved;
      case 'cleaning': return styles.tableCleaning;
      default: return '';
    }
  };

  return (
    <div className="container-fluid">
      <h2 className={`mb-4 ${sharedStyles.pageTitle}`}>
        <i className="bi bi-grid-3x3-gap-fill me-2"></i>Gerenciamento de Mesas
      </h2>

      {loading ? (
        <p>Carregando mesas...</p>
      ) : (
        <div className="row g-4">
          {tables.map(table => (
            <div key={table.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className={`card h-100 ${sharedStyles.cardDark} ${styles.tableCard} ${getStatusStyle(table.status)}`}>
                <div className="card-body text-center d-flex flex-column">
                  <div className={styles.tableNumber}>{table.table_number}</div>
                  <div className={styles.tableStatus}>
                    {traduzirStatus[table.status] || table.status}
                  </div>
                  <div className="mt-auto">
                    <p className="mb-2">
                      <i className="bi bi-people-fill me-1"></i> {table.capacity} Lugares
                    </p>
                    <p className="mb-3">
                      <i className="bi bi-receipt me-1"></i> {table.orders} Pedidos
                    </p>
                    <div className="d-grid gap-2">
                      <button className="btn btn-sm btn-primary">Ver Pedidos</button>
                      <button className="btn btn-sm btn-outline-light">Alterar Status</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TablesPage;
