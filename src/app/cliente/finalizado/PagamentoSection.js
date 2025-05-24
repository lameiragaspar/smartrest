// pasta: finalizado/PagamentoSection.jsx
import { useState } from 'react';
import { getPedidos } from '../pedido_temp';
import ClienteCard from './ClienteCard';
import styles from './finalizado.module.css';

export default function PagamentoSection({ mesaId }) {
  const telefone = '+244934557024';
  const pedidos = getPedidos();
  const [clientesPagos, setClientesPagos] = useState([]);
  const [mensagemPagamento, setMensagemPagamento] = useState(null);
  const [pagandoTotal, setPagandoTotal] = useState(false);

  const totaisClientes = pedidos.map((cliente) => {
    const itens = [];
    Object.entries(cliente.pedidos).forEach(([_, produtos]) => {
      produtos.forEach(p => {
        itens.push({ nome: p.name, preco: +p.price, quantidade: +p.quantidade });
      });
    });
    const subtotal = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    return { nome: cliente.nomeCliente, itens, subtotal };
  });

  const totalMesa = totaisClientes.reduce((soma, c) => soma + c.subtotal, 0);

  const pagarTotal = async () => {
    setPagandoTotal(true);
    try {
      await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesa_id: mesaId, valor: totalMesa, metodo: 'total' }),
      });
      setMensagemPagamento('Pagamento total da mesa confirmado!');
    } catch (err) {
      console.error('Erro ao pagar total da mesa:', err);
      setMensagemPagamento('Erro ao processar o pagamento total.');
    }
    setPagandoTotal(false);
  };

  return (
    <div className="text-white">
      <h4 className="text-center mb-4">💳 Pagamento da Mesa</h4>

      {totaisClientes.map((cliente, i) => (
        <ClienteCard
          key={i}
          cliente={cliente}
          telefone={telefone}
          mesaId={mesaId}
          clientesPagos={clientesPagos}
          setClientesPagos={setClientesPagos}
        />
      ))}

      <div className="mt-4 text-center">
        <h5>Total da mesa: <strong>{totalMesa.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</strong></h5>

        <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <button className="btn btn-primary" onClick={pagarTotal} disabled={pagandoTotal}>
            {pagandoTotal ? 'Processando...' : 'Pagar Total com Multicaixa Express'}
          </button>
          <button className="btn btn-warning" onClick={() => alert('Garçom foi chamado.')}>Chamar Garçom</button>
        </div>

        {mensagemPagamento && <p className="text-success mt-3">{mensagemPagamento}</p>}
      </div>
    </div>
  );
}