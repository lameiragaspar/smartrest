'use client'; // Required for App Router components with hooks

import React, { useState, useEffect, useRef } from 'react';
import { getPedidos, limparPedidos } from '../pedido_temp'; // Adjust path as needed
import { useRouter } from 'next/navigation';
import styles from './pagamento.module.css'; // Your CSS Module

// Mock data for waiters - in a real app, fetch this from a backend
const GARCONS_LISTA_MOCK = [
    { id: 'g1', nome: 'Carlos', senha: 'senha123' },
    { id: 'g2', nome: 'Ana', senha: 'senha456' },
    { id: 'g3', nome: 'Pedro', 'senha': 'senha789' },
];
const CODIGO_PAGAMENTO_GENERICO_ESPERADO = 'PGTOOK'; // Example generic code

const CardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </svg>
);

const ClienteCard = ({ cliente, isUnicoCliente }) => {
    return (
        <div className={`${styles.clienteCard}`}>
            <h5 className={`${styles.clienteCardNome}`}>{cliente.nomeCliente}</h5>
            <ul className="list-unstyled mb-0">
                {cliente.itens.map((item, index) => (
                    <li key={index} className={`${styles.clienteCardItem}`}>
                        <span>{item.nome} (x{item.quantidade})</span>
                        <span>{(item.preco * item.quantidade).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                    </li>
                ))}
            </ul>
            {!isUnicoCliente && (
                <div className={`${styles.clienteCardSubtotal}`}>
                    Subtotal: <span>{cliente.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                </div>
            )}
        </div>
    );
};

export default function PagamentoSection({ mesaId }) {
    const [pedidos, setPedidos] = useState([]);
    const [totaisClientes, setTotaisClientes] = useState([]);
    const [totalMesa, setTotalMesa] = useState(0);
    const [isUnicoCliente, setIsUnicoCliente] = useState(false);
    const [mensagem, setMensagem] = useState({ text: null, type: 'info' });
    const [confirmando, setConfirmando] = useState(false);
    const [metodoPagamento, setMetodoPagamento] = useState('cash'); // Default to cash

    const [showWaiterAuthModal, setShowWaiterAuthModal] = useState(false);
    const [selectedGarconId, setSelectedGarconId] = useState('');
    const [garconSenha, setGarconSenha] = useState('');
    const [codigoPagamentoGenerico, setCodigoPagamentoGenerico] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [modalErrorMessage, setModalErrorMessage] = useState('');
    const [garcons, setGarcons] = useState([]);
    const [waiterNotified, setWaiterNotified] = useState(false); // New state for waiter notification

    const router = useRouter();
    const modalElementRef = useRef(null);
    const [bootstrapModal, setBootstrapModal] = useState(null);

    useEffect(() => {
        const pedidosObtidos = getPedidos();
        setPedidos(pedidosObtidos);

        const calculoTotais = pedidosObtidos.map((cliente) => {
            const itens = [];
            Object.entries(cliente.pedidos).forEach(([_, produtos]) => {
                produtos.forEach(p => {
                    itens.push({ nome: p.name, preco: +p.price, quantidade: +p.quantidade });
                });
            });
            const subtotal = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
            return { nomeCliente: cliente.nomeCliente, clienteId: cliente.clienteId, itens, subtotal };
        });
        setTotaisClientes(calculoTotais);
        const calculoTotalMesa = calculoTotais.reduce((soma, c) => soma + c.subtotal, 0);
        setTotalMesa(calculoTotalMesa);
        setIsUnicoCliente(calculoTotais.length === 1);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && modalElementRef.current) {
            const Modal = require('bootstrap/js/dist/modal');
            setBootstrapModal(new Modal(modalElementRef.current));
        }
        return () => {
            if (bootstrapModal) {
                bootstrapModal.dispose();
            }
        };
    }, [modalElementRef.current]);

    useEffect(() => {
        fetch('/api/garcons')
            .then(res => res.json())
            .then(data => setGarcons(data.garcons || []))
            .catch(err => console.error('Erro ao buscar garçons:', err));
    }, []);


    const handleShowWaiterAuthModal = () => {
        setModalErrorMessage('');
        setSelectedGarconId(garcons[0]?.id || '');
        setGarconSenha('');
        setCodigoPagamentoGenerico('');
        setTransactionId('');
        setWaiterNotified(false); // Reset notification state
        if (bootstrapModal) {
            bootstrapModal.show();
        } else {
            setShowWaiterAuthModal(true);
        }
    };

    const handleHideWaiterAuthModal = () => {
        if (bootstrapModal) {
            bootstrapModal.hide();
        } else {
            setShowWaiterAuthModal(false);
        }
    };

    const handleNotifyWaiter = () => {
        setWaiterNotified(true);
    };

    const handleWaiterPaymentConfirmation = async () => {
        setModalErrorMessage('');
        if (!selectedGarconId) {
            setModalErrorMessage('Por favor, selecione um garçom.');
            return;
        }
        const garconSelecionado = garcons.find(g => g.id === selectedGarconId);
        if (!garconSelecionado) {
            setModalErrorMessage('Garçom inválido selecionado.');
            return;
        }
        if (garconSelecionado.senha !== garconSenha) {
            setModalErrorMessage('Senha do garçom incorreta.');
            return;
        }
        if (codigoPagamentoGenerico !== CODIGO_PAGAMENTO_GENERICO_ESPERADO) {
            setModalErrorMessage('Código de pagamento genérico incorreto.');
            return;
        }
        if ((metodoPagamento === 'transfer' || metodoPagamento === 'cartao' || metodoPagamento === 'mcexpress') && !transactionId) {
            setModalErrorMessage('ID da Transação é obrigatório para este método de pagamento.');
            return;
        }

        setConfirmando(true);
        setMensagem({ text: null, type: 'info' });
        handleHideWaiterAuthModal();

        const payload = {
            order_id: String(mesaId),
            amount: totalMesa,
            method: metodoPagamento,
            waiter_name: garconSelecionado.nome,
            waiter_id: garconSelecionado.id, // Adicionado ID do garçom
            transaction_id: transactionId || null,
        };

        try {
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.erro || `Erro ${res.status} ao confirmar pagamento.`);
            }

            limparPedidos();
            setMensagem({ text: data.mensagem || 'Pagamento confirmado com sucesso!', type: 'success' });

            setTimeout(() => {
                router.push('/'); // Redirect to homepage
            }, 60000); // 1 minute redirect

        } catch (err) {
            console.error("Erro ao confirmar pagamento:", err);
            setMensagem({ text: err.message || 'Erro ao confirmar o pagamento. Tente novamente.', type: 'error' });
        } finally {
            setConfirmando(false);
        }
    };


    if (pedidos.length === 0 && totalMesa === 0 && !confirmando && mensagem.type !== 'success') {
        return (
            <div className={`${styles.pagamentoContainer} container-fluid d-flex justify-content-center align-items-center`} style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <div className={`spinner-border ${styles.loadingSpinner}`} role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="mt-3">Carregando pedidos da mesa...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.pagamentoContainer} container-fluid`}>
            <div className="container">
                <h4 className={`${styles.sectionTitulo} text-center`}>
                    <CardIcon /> Pagamento da Mesa #{mesaId}
                </h4>

                {mensagem.text && (
                    <div className={`alert ${mensagem.type === 'error' ? styles.alertErro : mensagem.type === 'success' ? styles.alertSucesso : styles.alertInfo} alert-dismissible fade show`} role="alert">
                        {mensagem.text}
                        {mensagem.type !== 'success' && <button type="button" className="btn-close" onClick={() => setMensagem({ text: null, type: 'info' })} aria-label="Close"></button>}
                    </div>
                )}

                {mensagem.type !== 'success' && (
                    <div className="row gx-lg-5">
                        <div className="col-12 col-lg-7 mb-4 mb-lg-0">
                            <div className={`${styles.cardPrincipal}`}>
                                <div className="card-header text-center py-4"><h4 className="mb-0">Resumo dos Pedidos</h4></div>
                                <div className="card-body">
                                    {totaisClientes.length > 0 ? (
                                        totaisClientes.map((cliente, i) => (
                                            <ClienteCard key={cliente.clienteId || i} cliente={cliente} isUnicoCliente={isUnicoCliente} />
                                        ))
                                    ) : <p className="text-center text-muted">Nenhum pedido encontrado.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5">
                            <div className={`${styles.cardTotalMesa} mb-4`}>
                                <h5 className="mb-2">Total da Mesa</h5>
                                <p className={`${styles.totalMesaValor}`}>
                                    {totalMesa.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                                </p>
                                {metodoPagamento === 'mcexpress' && (
                                    <div className="text-center mt-3">
                                        <img src="/images/qr-code-placeholder.png" alt="QR Code Multicaixa Express" className="img-fluid" style={{ maxWidth: '150px' }} />
                                        <p className="mt-2">Use o Multicaixa Express para pagar.</p>
                                    </div>
                                )}
                            </div>

                            {totalMesa > 0 && (
                                <div className={`${styles.cardPrincipal}`}>
                                    <div className="card-header text-center py-4"><p className='mb-0'>Finalizar Pagamento</p></div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label htmlFor="metodoPagamento" className={`${styles.formLabel} form-label`}>Método de Pagamento:</label>
                                            <select
                                                id="metodoPagamento"
                                                className={`${styles.formSelect} form-select`}
                                                value={metodoPagamento}
                                                onChange={(e) => setMetodoPagamento(e.target.value)}
                                                disabled={confirmando}
                                            >
                                                <option value="cash">Dinheiro</option>
                                                <option value="mcexpress">Multicaixa Express (via Garçom)</option>
                                                <option value="transfer">Transferência Bancária (via Garçom)</option>
                                                <option value="cartao">Cartão Multicaixa/TPA (via Garçom)</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={handleShowWaiterAuthModal}
                                            disabled={confirmando || totalMesa === 0}
                                            className={`btn ${styles.btnAmarelo} w-100`}
                                        >
                                            {confirmando ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processando...</>
                                            ) : (
                                                'Chamar Garçom para Confirmar Pagamento'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Authentication*/}
            <div className="modal fade" ref={modalElementRef} id="waiterAuthModal" tabIndex="-1" aria-labelledby="waiterAuthModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered">
                    <div className={`modal-content ${styles.modalContentCustom}`}>
                        <div className={`modal-header ${styles.modalHeaderCustom}`}>
                            <h5 className="modal-title" id="waiterAuthModalLabel">Confirmação do Garçom</h5>
                            <button type="button" className="btn-close" onClick={handleHideWaiterAuthModal} aria-label="Close" disabled={confirmando}></button>
                        </div>
                        <div className="modal-body">
                            {modalErrorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {modalErrorMessage}
                                </div>
                            )}

                            {!waiterNotified ? (
                                <div className="text-center">
                                    <p className="lead">O garçom foi notificado para confirmar o pagamento.</p>
                                    <p>Por favor, aguarde a chegada do garçom para prosseguir com a autenticação.</p>
                                    <button
                                        type="button"
                                        className={`btn ${styles.btnSucesso} mt-3`}
                                        onClick={handleNotifyWaiter} // This button will actually advance the modal content
                                        disabled={confirmando}
                                    >
                                        Avançar
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={(e) => { e.preventDefault(); handleWaiterPaymentConfirmation(); }}>
                                    <div className="mb-3">
                                        <label htmlFor="garconSelect" className="form-label">Garçom:</label>
                                        <select
                                            id="garconSelect"
                                            className="form-select"
                                            value={selectedGarconId}
                                            onChange={(e) => setSelectedGarconId(e.target.value)}
                                            disabled={confirmando}
                                        >
                                            <option value="" disabled>Selecione o garçom</option>
                                            {garcons.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="garconSenha" className="form-label">Senha do Garçom:</label>
                                        <input
                                            type="password"
                                            id="garconSenha"
                                            className="form-control"
                                            value={garconSenha}
                                            onChange={(e) => setGarconSenha(e.target.value)}
                                            disabled={confirmando}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="codigoPagamento" className="form-label">Código de Pagamento Genérico:</label>
                                        <input
                                            type="text"
                                            id="codigoPagamento"
                                            className="form-control"
                                            value={codigoPagamentoGenerico}
                                            onChange={(e) => setCodigoPagamentoGenerico(e.target.value)}
                                            disabled={confirmando}
                                        />
                                    </div>
                                    {(metodoPagamento === 'transfer' || metodoPagamento === 'cartao' || metodoPagamento === 'mcexpress') && (
                                        <div className="mb-3">
                                            <label htmlFor="transactionId" className="form-label">ID da Transação (TPA/Referência):</label>
                                            <input
                                                type="text"
                                                id="transactionId"
                                                className="form-control"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                disabled={confirmando}
                                            />
                                        </div>
                                    )}
                                    <div className={`modal-footer ${styles.modalFooterCustom} mt-3 p-0 border-0`}>
                                        <button type="button" className={`btn ${styles.btnCinza} me-2`} onClick={handleHideWaiterAuthModal} disabled={confirmando}>Cancelar</button>
                                        <button type="submit" className={`btn ${styles.btnSucesso}`} disabled={confirmando}>
                                            {confirmando ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Confirmando...</> : 'Confirmar Pagamento'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}