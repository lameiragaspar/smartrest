// pasta: finalizado/FinalizadoPage.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusSection from './StatusSection';
import AvaliacaoSection from './AvaliacaoSection';
import PagamentoSection from './PagamentoSection';
import styles from './finalizado.module.css';

export default function FinalizadoPage() {
  const router = useRouter();
  const [etapa, setEtapa] = useState('status');
  const [status, setStatus] = useState(null);
  const [mensagem, setMensagem] = useState('Aguardando status do pedido...');
  const [loading, setLoading] = useState(true);
  const [mesaId, setMesaId] = useState(null);

  useEffect(() => {
    const mesa = localStorage.getItem('mesa');
    if (!mesa) {
      setMensagem('Mesa não encontrada. Redirecionando...');
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    setMesaId(mesa);
    fetchStatus(mesa);
    const interval = setInterval(() => fetchStatus(mesa), 5000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchStatus = async (mesa) => {
    try {
      const res = await fetch(`/api/pedido/status?mesa=${mesa}`);
      if (!res.ok) throw new Error('Resposta inválida da API');
      const data = await res.json();

      if (data?.status) {
        setStatus(data.status);
        setLoading(false);

        const mensagens = {
          pendente: 'Seu pedido foi enviado e está aguardando confirmação.',
          'em preparo': 'A cozinha está preparando seus pratos...',
          pronto: 'Seu pedido está pronto para ser servido!',
          entregue: 'Seu pedido foi entregue. Bom apetite!',
        };

        setMensagem(mensagens[data.status] || 'Aguardando atualização do pedido...');
        if (data.status === 'entregue' && !localStorage.getItem(`avaliado-${mesa}`)) {
          setEtapa('avaliacao');
        }
      } else {
        setTimeout(() => {
          setMensagem('Nenhum pedido encontrado para esta mesa.');
          setLoading(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Erro ao buscar status:', err);
      setMensagem('Erro ao buscar status. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className={`container py-5 ${styles.finalizadoContainer}`}>
      {etapa === 'status' && (
        <StatusSection
          status={status}
          mensagem={mensagem}
          loading={loading}
          onTerminar={() => setEtapa('avaliacao')}
          onNovoPedido={() => router.push('/cardapio')}
          mesa = {mesaId}
        />
      )}
      {etapa === 'avaliacao' && (
        <AvaliacaoSection
          mesaId={mesaId}
          onFinalizar={() => setEtapa('pagamento')}
        />
      )}
      {etapa === 'pagamento' && <PagamentoSection mesaId={mesaId} />}
    </div>
  );
} 
