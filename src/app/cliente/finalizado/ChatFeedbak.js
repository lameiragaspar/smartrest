'use client';

import { useState } from 'react';
import styles from './statusSection.module.css';

const mensagensPredefinidasIniciais = [
  'Gostaria de mais guardanapos',
  'A comida está demorando',
  'Preciso de ajuda com o pedido',
  'Ótimo atendimento!',
  'A comida chegou fria',
];

export default function ChatFeedback({ mesa }) {
  const [mensagens, setMensagens] = useState([]);
  const [mensagemAtual, setMensagemAtual] = useState('');
  const [mostrarPredefinidas, setMostrarPredefinidas] = useState(true);

  const enviarMensagem = async (texto) => {
    if (!texto.trim()) return;

    const idTemp = Date.now();

    const novaMensagem = {
      id: idTemp,
      texto,
      status: 'sending', // nova propriedade
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    if (mostrarPredefinidas) setMostrarPredefinidas(false);
    setMensagemAtual('');

    try {
      const response = await fetch('/api/cliente/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: mesa, // Correto: agora usa o número da mesa
          reason: texto,
          status: 'pendente',
        }),
      });

      if (!response.ok) throw new Error('Erro no envio');

      setMensagens((prev) =>
        prev.map((msg) =>
          msg.id === idTemp ? { ...msg, status: 'sent' } : msg
        )
      );
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setMensagens((prev) =>
        prev.map((msg) =>
          msg.id === idTemp ? { ...msg, status: 'error' } : msg
        )
      );
    }
  };

  return (
    <div className={styles.chatWidget}>
      <div className={styles.chatHeader}>Enviar Feedback ou Solicitação</div>

      <div className={styles.chatBody}>
        {mensagens.map((msg) => (
          <div key={msg.id} className={styles.chatMessage}>
            <span>{msg.texto}</span>
            <span className={styles.statusIcon}>
              {msg.status === 'sending' && '⌛'} {/* relógio */}
              {msg.status === 'sent' && '✓✓'}   {/* duplo check */}
              {msg.status === 'error' && '❌'}  {/* erro */}
            </span>
          </div>
        ))}

        {mostrarPredefinidas && (
          <div className={styles.chatPredefinidos}>
            {mensagensPredefinidasIniciais.map((txt, i) => (
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
