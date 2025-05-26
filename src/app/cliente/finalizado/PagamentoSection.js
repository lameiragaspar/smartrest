import { useState } from 'react';
import { getPedidos, limparPedidos } from '../pedido_temp';
import ClienteCard from './ClienteCard';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import styles from './pagamento.module.css';

export default function PagamentoSection({ mesaId }) {
    const telefone = '+244934557024';
    const pedidos = getPedidos();
    const [clientesPagos, setClientesPagos] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [confirmando, setConfirmando] = useState(false);
    const [comprovativo, setComprovativo] = useState(null);
    const [metodoPagamento, setMetodoPagamento] = useState('cash');
    const [modalGarcom, setModalGarcom] = useState(false);
    const router = useRouter()

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
            router.push('/')

        }
    };

    return (
        <div className="container text-white py-4">
            <h4 className={`${styles.sectionTitulo} mb-4`}>💳 Pagamento da Mesa</h4>

            <div className="row gx-4">
                <div className="col-12 col-lg-8">
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

                <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                    <div className={`bg-dark border rounded p-3 mb-4 text-center`}>
                        <h5 className="text-white mb-3">Total da Mesa</h5>
                        <p className="fs-5 fw-bold text-success">
                            {totalMesa.toLocaleString('pt-AO', {
                                style: 'currency',
                                currency: 'AOA'
                            })}
                        </p>

                        {metodoPagamento === 'mcexpress' ? (
                            <>
                                <QRCode value={urlQrCode} size={180} />
                                <p className="text-light mt-2">Escaneie com o Multicaixa Express</p>
                            </>
                        ) : (
                            metodoPagamento !== 'mcexpress' && (
                                <div className="text-center">
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => setModalGarcom(true)}
                                    >
                                        Chamar Garçom
                                    </button>
                                </div>
                            )

                        )}
                    </div>

                    <div className="bg-dark rounded p-3">
                        <div className="mb-3">
                            <label className="form-label">Método de Pagamento</label>
                            <select
                                className="form-select"
                                value={metodoPagamento}
                                onChange={(e) => setMetodoPagamento(e.target.value)}
                            >
                                <option value="cash">Dinheiro</option>
                                <option value="mcexpress">Multicaixa Express</option>
                                <option value="transfer">Transferência Bancária</option>
                                <option value="cartao">Cartão Multicaixa/TPA</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Comprovativo (opcional)</label>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="form-control"
                                onChange={(e) => setComprovativo(e.target.files[0])}
                            />
                        </div>

                        <button
                            className="btn btn-success w-100"
                            disabled={confirmando}
                            onClick={confirmarPagamento}
                        >
                            {confirmando ? 'Enviando...' : 'Confirmar Pagamento'}
                        </button>

                        {mensagem && (
                            <div className="alert alert-info mt-3" role="alert">
                                {mensagem}
                            </div>
                        )}
                        {/* Modal Garçom Notificado */}
                        {modalGarcom && (
                            <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className=" shadow-lg modal-content  bg-dark text-white">
                                        <div className="modal-header border-0">
                                            <h5 className="modal-title">✅ Garçom Notificado</h5>
                                            <button
                                                type="button"
                                                className="btn-close btn-close-white"
                                                onClick={() => setModalGarcom(false)}
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <p>O garçom foi informado. Por favor, aguarde na mesa.</p>
                                        </div>
                                        <div className="modal-footer border-0">
                                            <button
                                                type="button"
                                                className="btn btn-outline-light"
                                                onClick={() => setModalGarcom(false)}
                                            >
                                                Fechar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/*
                                <div className="modal-backdrop fade show"></div>*/}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
