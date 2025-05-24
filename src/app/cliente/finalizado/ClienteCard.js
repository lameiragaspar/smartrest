import { useState } from 'react';
import React from 'react';
import QRCode from 'react-qr-code';

export default function ClienteCard({ cliente, mesaId, clientesPagos, setClientesPagos }) {
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
        } catch (err){
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

                <button className="btn btn-sm btn-outline-info" onClick={() => setMostrarQr(!mostrarQr)}>
                    {mostrarQr ? 'Ocultar QR' : 'Pagar no Express'}
                </button>
            </div>

            {mostrarQr && (
                <div className="mt-3">
                    <div style={{ width: 200, margin: 'auto' }}>
                        <QRCode value={`https://app.appypay.co.ao/qrcode?phone=+244934557024&amount=${cliente.subtotal}&reference=Cliente:${cliente.nome}`} />
                    </div>
                </div>
            )}

        </div>
    );
}
