// pasta: finalizado/ClienteCard.jsx
import { useState } from 'react';

export default function ClienteCard({ cliente, telefone, mesaId, clientesPagos, setClientesPagos }) {
  const [pagando, setPagando] = useState(false);
  const [mostrarQr, setMostrarQr] = useState(false);
  const pago = clientesPagos.includes(cliente.nome);

  const pagarCliente = async () => {
    setPagando(true);
    try {
      await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesa_id: mesaId, valor: cliente.subtotal, metodo: 'individual', cliente: cliente.nome }),
      });
      setClientesPagos(prev => [...prev, cliente.nome]);
    } catch (err) {
      console.error('Erro ao pagar cliente:', err);
    }
    setPagando(false);
  };

  return (
    <div className="bg-dark rounded p-3 mb-3 text-light">
      <h5 className="text-info">{cliente.nome}</h5>
      <ul className="list-unstyled">
        {cliente.itens.map((item, idx) => (
          <li key={idx}>
            {item.quantidade}x {item.nome} — {(item.preco * item.quantidade).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
          </li>
        ))}
      </ul>

      <p className="fw-bold text-success">
        Subtotal: {cliente.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
      </p>

      <div className="d-flex gap-2 flex-wrap">
        {!pago && (
          <button className="btn btn-sm btn-outline-success" onClick={pagarCliente} disabled={pagando}>
            {pagando ? 'Processando...' : 'Pagar'}</button>
        )}
        {pago && <span className="badge bg-success align-self-center">Pago</span>}

        <button className="btn btn-sm btn-outline-info" onClick={() => setMostrarQr(!mostrarQr)}>
          {mostrarQr ? 'Ocultar QR' : 'Mostrar QR'}
        </button>
      </div>

      {mostrarQr && (
        <div className="mt-3">
          <img
            src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(
              `https://app.appypay.co.ao/qrcode?phone=${telefone}&amount=${cliente.subtotal}&reference=Cliente:${cliente.nome}`
            )}`}
            alt={`QR Code de ${cliente.nome}`}
          />
        </div>
      )}
    </div>
  );
}
