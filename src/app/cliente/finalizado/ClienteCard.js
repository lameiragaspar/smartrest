import { useState } from 'react';
import QRCode from 'react-qr-code';
import styles from './pagamento.module.css';

export default function ClienteCard({ cliente, mesaId, clientesPagos, setClientesPagos }) {
    const [mostrarQr, setMostrarQr] = useState(false);
    const pago = clientesPagos.includes(cliente.nome);

    // Verifica se há pelo menos 2 clientes na mesa (pagos + não pagos)
    const totalClientesNaMesa = clientesPagos.length + (clientesPagos.includes(cliente.nome) ? 0 : 1);
    const podeMostrarQR = totalClientesNaMesa >= 2;

    return (
        <div className="bg-dark rounded shadow p-4 mb-4">
            <h5 className="text-info fw-semibold mb-3">{cliente.nome}</h5>

            <ul className="list-unstyled mb-3">
                {cliente.itens.map((item, idx) => (
                    <li key={idx} className="text-light d-flex justify-content-between">
                        <div>
                            <span className="text-secondary">{item.quantidade}x</span> {item.nome}
                        </div>
                        <span className="text-success">
                            {(item.preco * item.quantidade).toLocaleString('pt-AO', {
                                style: 'currency',
                                currency: 'AOA'
                            })}
                        </span>
                    </li>
                ))}
            </ul>

            <p className="fw-bold text-success mb-3">
                Subtotal: {cliente.subtotal.toLocaleString('pt-AO', {
                    style: 'currency',
                    currency: 'AOA'
                })}
            </p>

            {!pago && podeMostrarQR && (
                <div className="d-flex flex-wrap gap-2">
                    <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setMostrarQr(!mostrarQr)}
                    >
                        {mostrarQr ? 'Ocultar QR' : 'Pagar com Express'}
                    </button>
                </div>
            )}

            {pago && (
                <p className="text-success mt-3">✅ Pagamento confirmado para este cliente.</p>
            )}

            {mostrarQr && (
                <div className="mt-4 text-center">
                    <QRCode
                        value={`https://app.appypay.co.ao/qrcode?phone=+244934557024&amount=${cliente.subtotal}&reference=Cliente:${cliente.nome}`}
                        size={180}
                    />
                    <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>
                        Escaneie com o Multicaixa Express
                    </p>
                </div>
            )}
        </div>
    );
}
