'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import styles from './avaliacao.module.css';

export default function AvaliacaoSection({ mesaId, onFinalizar }) {
  const [avaliacao, setAvaliacao] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);

  const enviarAvaliacao = async () => {
    if (!mesaId || avaliacao === 0) return;

    try {
      await fetch('/api/avaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesa_id: mesaId, nota: avaliacao, comentario }),
      });

      localStorage.setItem(`avaliado-${mesaId}`, 'true');
      setEnviado(true);
      setTimeout(onFinalizar, 1500);
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={styles.container}
    >
      <h4 className={styles.title}>⭐ Avalie nossos pratos e serviços:</h4>

      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <FaStar
            key={n}
            className={`${styles.star} ${n <= avaliacao ? styles.starActive : ''}`}
            onClick={() => setAvaliacao(n)}
          />
        ))}
      </div>

      <div className="mb-3">
        <textarea
          className={`form-control ${styles.textarea}`}
          rows="3"
          placeholder="Deixe um comentário opcional..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        ></textarea>
      </div>

      <button
        className="btn btn-success"
        onClick={enviarAvaliacao}
        disabled={enviado || avaliacao === 0}
      >
        Enviar avaliação
      </button>

      {enviado && <p className={styles.success}>Obrigado pela sua avaliação!</p>}
    </motion.div>
  );
}