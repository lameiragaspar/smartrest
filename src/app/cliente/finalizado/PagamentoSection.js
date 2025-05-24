import { useState } from 'react';
import { getPedidos, limparPedidos } from '../pedido_temp';
import ClienteCard from './ClienteCard';
import QRCode from 'react-qr-code';
import styles from './finalizado.module.css';

export default function PagamentoSection({ mesaId }) {
    const telefone = '+244934557024';
    const pedidos = getPedidos();
    const [clientesPagos, setClientesPagos] = useState([]);
    const [mensagemPagamento, setMensagemPagamento] = useState(null);
    const [pagandoTotal, setPagandoTotal] = useState(false);
    const [mostrarModalQR, setMostrarModalQR] = useState(false);
    const [mostrarModalGarcom, setMostrarModalGarcom] = useState(false);
    const [comprovativo, setComprovativo] = useState(null);
    const [confirmando, setConfirmando] = useState(false);
    const [mensagemFinal, setMensagemFinal] = useState(null);

    const confirmarPagamento = async () => {
        if (!comprovativo) {
            setMensagemFinal('Por favor, envie o comprovativo antes de confirmar.');
            return;
        }

        const formData = new FormData();
        formData.append('mesa_id', mesaId);
        formData.append('comprovativo', comprovativo);

        setConfirmando(true);
        setMensagemFinal(null);

        try {
            const res = await fetch('../api/finalizar', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Erro na finalização');
            const data = await res.json();
            limparPedidos()
            setMensagemFinal(data.mensagem || 'Pagamento confirmado e mesa liberada!');
            setMensagemPagamento('Pagamento total da mesa confirmado!');
        } catch (err) {
            console.error(err);
            setMensagemFinal('Erro ao confirmar o pagamento.');
        }

        setConfirmando(false);
    };

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

    const urlQrCode = `https://app.appypay.co.ao/qrcode?phone=${telefone}&amount=${totalMesa}&reference=Mesa:${mesaId}`;

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
                    <button className="btn btn-primary" onClick={() => setMostrarModalQR(true)} disabled={pagandoTotal}>
                        {pagandoTotal ? 'Processando...' : 'Pagar Total com Multicaixa Express'}
                    </button>
                    <button className="btn btn-warning" onClick={() => setMostrarModalGarcom(true)}>
                        Chamar Garçom
                    </button>
                </div>

                {mensagemPagamento && <p className="text-success mt-3">{mensagemPagamento}</p>}
            </div>
            <div className="mt-5">
                <h5 className="mb-2">📤 Enviar comprovativo e finalizar</h5>
                <input
                    type="file"
                    accept="image/*,.pdf"
                    className="form-control mb-2"
                    onChange={e => setComprovativo(e.target.files[0])}
                />
                <button className="btn btn-success" onClick={confirmarPagamento} disabled={confirmando}>
                    {confirmando ? 'Enviando...' : 'Confirmar Pagamento'}
                </button>
                {mensagemFinal && <p className="mt-2 text-info">{mensagemFinal}</p>}
            </div>


            {/* Modal QR Code */}
            {mostrarModalQR && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0,
                        width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setMostrarModalQR(false)}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: 30,
                            borderRadius: 10,
                            textAlign: 'center',
                            maxWidth: 300,
                            width: '90%'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h5 className="mb-3">Escaneie para pagar a mesa</h5>
                        <QRCode value={urlQrCode} size={200} />
                        <button className="btn btn-secondary mt-3" onClick={() => setMostrarModalQR(false)}>Fechar</button>
                    </div>
                </div>
            )}

            {/* Modal Garçom */}
            {mostrarModalGarcom && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0,
                        width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setMostrarModalGarcom(false)}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: 30,
                            borderRadius: 10,
                            textAlign: 'center',
                            maxWidth: 300,
                            width: '90%'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h5 className="mb-3 text-muted">✅ Garçom foi notificado</h5>
                        <p className='text-muted'>Por favor, aguarde. Em breve alguém irá até sua mesa.</p>
                        <button className="btn btn-secondary mt-3" onClick={() => setMostrarModalGarcom(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
