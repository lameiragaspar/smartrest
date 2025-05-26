'use client';

import { useState } from 'react';
import styles from './statusSection.module.css';

const mensagensPredefinidas = [
  'Gostaria de mais guardanapos',
  'A comida está demorando',
  'Preciso de ajuda com o pedido',
  'Ótimo atendimento!',
  'A comida chegou fria',
];

export default function ChatFeedback({ mesa }) {
  const [mensagens, setMensagens] = useState([]);
  const [mensagemAtual, setMensagemAtual] = useState('');

  const enviarMensagem = async (texto) => {
    if (!texto.trim()) return;

    const novaMensagem = {
      texto,
      id: Date.now(),
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    setMensagemAtual('');

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_id: mesa,
          reason: texto,
          status: 'pendente',
        }),
      });
    } catch (err) {
      console.error('Erro ao enviar feedback:', err);
    }
  };

  return (
    <div className={styles.chatWidget}>
      <div className={styles.chatHeader}>Enviar Feedback</div>
      <div className={styles.chatBody}>
        {mensagens.map((msg) => (
          <div key={msg.id} className={styles.chatMessage}>
            {msg.texto}
          </div>
        ))}

        {mensagemAtual.trim() === '' && (
          <div className={styles.chatPredefinidos}>
            {mensagensPredefinidas.map((txt, i) => (
              <button key={i} onClick={() => enviarMensagem(txt)}>
                {txt}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.chatInput}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviarMensagem(mensagemAtual);
          }}
        >
          <input
            type="text"
            placeholder="Escreva uma mensagem..."
            value={mensagemAtual}
            onChange={(e) => setMensagemAtual(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}
