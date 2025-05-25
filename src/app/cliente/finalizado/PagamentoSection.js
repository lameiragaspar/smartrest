import { useState, useEffect } from 'react';
import { getPedidos, limparPedidos } from '../pedido_temp';
import ClienteCard from './ClienteCard';
import QRCode from 'react-qr-code';
import styles from './finalizado.module.css';

export default function PagamentoSection({ mesaId }) {
    const telefone = '+244934557024';
    const pedidos = getPedidos();
    const [clientesPagos, setClientesPagos] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [confirmando, setConfirmando] = useState(false);
    const [comprovativo, setComprovativo] = useState(null);
    const [metodoPagamento, setMetodoPagamento] = useState('cash');
    const [mostrarQR, setMostrarQR] = useState(false);
    const [mostrarGarcom, setMostrarGarcom] = useState(false);

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

    const confirmarPagamento = async () => {
        if (!comprovativo && metodoPagamento !== 'cash' && metodoPagamento !== 'mcexpress') {
            setMensagem('Por favor, envie o comprovativo antes de confirmar.');
            return;
        }

        const formData = new FormData();
        formData.append('order_id', mesaId);
        formData.append('amount', totalMesa);
        formData.append('method', metodoPagamento);
        if (comprovativo) formData.append('comprovativo', comprovativo);

        setConfirmando(true);
        setMensagem(null);

        try {
            const res = await fetch('../api/finalizar', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Erro na finalização');
            const data = await res.json();
            limparPedidos();
            setMensagem(data.mensagem || 'Pagamento confirmado com sucesso!');
        } catch (err) {
            setMensagem('Erro ao confirmar o pagamento. Tente novamente.');
        } finally {
            setConfirmando(false);
        }
    };

    return (
        <div className="container text-white">
            <h4 className="text-center mb-4">💳 Pagamento da Mesa</h4>

            <div className="container" style={{ maxWidth: '1024px' }}>
                <div className="d-flex flex-column flex-md-row align-items-start gap-4">
                    <div className="flex-fill">
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
                    </div>

                    {metodoPagamento === 'mcexpress' && (
                        <div className="text-center">
                            <QRCode value={urlQrCode} size={180} />
                            <p className="mt-2 text-muted">Escaneie o QR Code com o Multicaixa Express</p>
                        </div>
                    )}
                    {metodoPagamento !== 'mcexpress' && (
                        <div className="text-center">
                            <button className="btn btn-warning" onClick={() => setMostrarGarcom(true)}>Chamar Garçom</button>
                        </div>
                    )}

                </div>

            </div>

            <div className="text-center mt-4">
                <h5>Total da mesa: <strong>{totalMesa.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</strong></h5>
            </div>

            <div className="mt-4">
                <label className="form-label">Método de Pagamento</label>
                <select
                    className="form-select mb-3 w-auto"
                    value={metodoPagamento}
                    onChange={(e) => setMetodoPagamento(e.target.value)}
                >
                    <option value="cash">Dinheiro</option>
                    <option value="mcexpress">Multicaixa Express</option>
                    <option value="transfer">Transferência Bancária</option>
                    <option value="cartao">Cartão Multicaixa/TPA</option>
                </select>

                <input
                    type="file"
                    accept="image/*,.pdf"
                    className="form-control mb-3 w-auto"
                    onChange={(e) => setComprovativo(e.target.files[0])}
                />


                <button
                    className="btn btn-success mt-2"
                    disabled={confirmando}
                    onClick={confirmarPagamento}
                >
                    {confirmando ? 'Enviando...' : 'Confirmar Pagamento'}
                </button>

                {mensagem && <div className="alert alert-info mt-3 text-center">{mensagem}</div>}
            </div>

            {/* Modal Garçom */}
            {mostrarGarcom && (
                <div className={styles.modalOverlay} onClick={() => setMostrarGarcom(false)}>
                    <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                        <h5 className="mb-3 text-muted">✅ Garçom foi notificado</h5>
                        <p className="text-muted">Por favor, aguarde. Em breve alguém irá até sua mesa.</p>
                        <button className="btn btn-secondary mt-3" onClick={() => setMostrarGarcom(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
