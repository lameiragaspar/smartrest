'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import styles from './avaliacao.module.css';

export default function AvaliacaoSection({ mesaId, onFinalizar }) {
  const [avaliacao, setAvaliacao] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviarAvaliacao = async () => {
    if (!mesaId || avaliacao === 0 || enviando) return;

    setEnviando(true);

    try {
      const res = await fetch('/api/cliente/avaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesa_id: mesaId, nota: avaliacao, comentario }),
      });

      if (res.ok) {
        localStorage.setItem('avaliacaoFeita', 'true');
        setEnviado(true);
        setTimeout(onFinalizar, 1500);
      } else {
        console.error('Falha ao enviar avaliação:', res.status);
      }
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
    } finally {
      setEnviando(false);
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
          disabled={enviando}
        ></textarea>
      </div>

      <div className="d-flex justify-content-center">
        <button
          className="btn btn-success d-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto"
          style={{ maxWidth: '300px' }}
          onClick={enviarAvaliacao}
          disabled={enviando || enviado || avaliacao === 0}
        >
          {enviando && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {enviando ? 'Enviando avaliação...' : 'Enviar avaliação'}
        </button>
      </div>

      {enviado && <p className={styles.success}>Obrigado pela sua avaliação!</p>}
    </motion.div>
  );
}
