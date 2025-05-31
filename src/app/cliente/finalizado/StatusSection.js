'use client';

import { motion } from 'framer-motion';
import styles from './statusSection.module.css';
import ChatWrapper from './chat';

export default function StatusSection({ status, mensagem, loading, onTerminar, onNovoPedido, mesa }) {
  const imagens = {
    pendente: '/img/illustrations/pendente.svg',
    'em preparo': '/img/illustrations/em_preparo.svg',
    pronto: '/img/illustrations/pronto.svg',
    entregue: '/img/illustrations/entregue.svg',
  };

  // Textos dinâmicos para o título H2
  const statusTextos = {
    pendente: '⌛ Pedido na Fila!',
    'em preparo': '👨‍🍳 Em Preparo!',
    pronto: '🍽️ Pedido Pronto!',
    entregue: '🎉 Pedido Entregue!',
  };

  // Textos alternativos para as imagens
  const altTextos = {
    pendente: 'Ilustração de um pedido pendente, aguardando na fila.',
    'em preparo': 'Ilustração de um chef preparando o pedido na cozinha.',
    pronto: 'Ilustração de um prato pronto para ser servido.',
    entregue: 'Ilustração de um pedido entregue ao cliente.',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Animação de entrada sutil
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="d-flex flex-column align-items-center justify-content-center text-center"
    >
      <motion.img
        src={imagens[status] || imagens['pendente']}
        alt={altTextos[status] || 'Status do pedido'}
        className={styles.statusImage}
        style={{ maxWidth: 380 }}
        // Animação em Loop para a imagem
        animate={{
          scale: [1, 1.03, 1],
          opacity: [1, 0.95, 1],
        }}
        transition={{
          duration: 4, // Duração mais longa para suavidade
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />

      <h2 className={`${styles.statusTitle} mt-4 mb-3`}>
        {/* Usa o texto dinâmico do status */}
        {statusTextos[status] || 'Status do Pedido'}
      </h2>

      <p className={`${styles.statusMessage} mb-4`}>
        {mensagem || 'Acompanhe o status do seu pedido por aqui.'}
      </p>

      {!loading && status === 'entregue' && (
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 mt-4 w-100 px-3">
          {/* Botão Primário */}
          <button
            className={`${styles.primaryButton} shadow-sm`}
            onClick={onNovoPedido}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>Fazer Novo Pedido
          </button>

          {/* Botão Secundário */}
          <button
            className={`${styles.secondaryButton}`}
            onClick={onTerminar}
          >
            <i className="bi bi-check-circle-fill me-2"></i>Encerrar Mesa
          </button>
        </div>
      )}


      {!loading && status !== 'entregue' && (
        <small className={`${styles.autoUpdateText} mt-4`}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Esta página será atualizada automaticamente com o status do seu pedido.
        </small>
      )}
      {/* Mantém o ChatWrapper, se necessário */}
      {mesa && <ChatWrapper mesa={mesa} />}
    </motion.div>
  );
}