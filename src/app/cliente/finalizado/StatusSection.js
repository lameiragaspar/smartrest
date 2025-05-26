'use client';

import { motion } from 'framer-motion';
import styles from './statusSection.module.css';
import ChatWrapper from './chat';

export default function StatusSection({ status, mensagem, loading, onTerminar, onNovoPedido, mesa }) {
  const imagens = {
    pendente: '/img/illustrations/pendente.svg',
    'em preparo': '/img/illustrations/em_preparo.svg',
    pronto: '/img/illustrations/pronto.svg',
    entregue: '/img/illustrations/entregue.svg'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="d-flex flex-column align-items-center justify-content-center text-center"
    >
      <img
        src={imagens[status]}
        alt={`Status: ${status}`}
        className={` ${styles.image}`}
        style={{ maxWidth: 400 }}
      />

      <h2 className="text-success fw-bold mb-3 fs-3">
        ✅ Pedido enviado com sucesso!
      </h2>

      <p className="text-light fs-5 mb-4" style={{ maxWidth: 600 }}>
        {mensagem}
      </p>

      {!loading && status === 'entregue' && (
        <div className="d-flex flex-column gap-2 align-items-center">
          <button className="btn btn-success px-4 py-2 fw-bold shadow-sm" onClick={onNovoPedido}>
            🍽️ Fazer novos pedidos
          </button>

          <button className="btn btn-outline-light px-4 py-2 fw-semibold" onClick={onTerminar}>
            ✅ Terminei a refeição
          </button>
        </div>
      )}

      {!loading && status !== 'entregue' && (
        <small className="text-secondary mt-3">
          Esta página será atualizada automaticamente...
        </small>
      )}
      {mesa && <ChatWrapper mesa={mesa} />}
    </motion.div>
  );
}
