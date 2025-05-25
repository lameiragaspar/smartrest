import { motion } from 'framer-motion';
import styles from './finalizado.module.css';

export default function StatusSection({ status, mensagem, loading, onTerminar, onNovoPedido }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: '80vh' }}
    >

      {status === 'pendente' && (
        <img
        src="/img/illustrations/pendente.svg"
        alt="Pedido finalizado"
        className={`mb-4 ${styles.image}`}
      />
      )}
      {status === 'em preparo' && (
        <img
        src="/img/illustrations/em_preparo.svg"
        alt="Pedido finalizado"
        className={`mb-4 ${styles.image}`}
      />
      )}
      {status === 'pronto' && (
        <img
        src="/img/illustrations/pronto.svg"
        alt="Pedido finalizado"
        className={`mb-4 ${styles.image}`}
      />
      )}
      {status === 'entregue' && (
        <img
        src="/img/illustrations/entregue.svg"
        alt="Pedido finalizado"
        className={`mb-4 ${styles.image}`}
      />
      )}

      <h2 className="text-success mb-3 fw-bold">
        ✅ Pedido enviado com sucesso!
      </h2>

      <p className="text-white mb-4 fs-5">{mensagem}</p>

      {!loading && status === 'entregue' && (
        <div className="d-flex flex-column gap-2">
          <button className="btn btn-success" onClick={onNovoPedido}>
            Fazer novos pedidos
          </button>

          <button className="btn btn-outline-light" onClick={onTerminar}>
            Terminei a refeição
          </button>
        </div>
      )}

      {!loading && status !== 'entregue' && (
        <small className="text-secondary">
          Esta página será atualizada automaticamente...
        </small>
      )}
    </motion.div>
  );
}
