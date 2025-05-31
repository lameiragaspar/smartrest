// app/pagamento/PagamentoSection.js
'use client';

import React, { useState, useEffect } from 'react';
import { getPedidos, limparPedidos } from '../pedido_temp';
import { useRouter } from 'next/navigation';
import styles from './pagamento.module.css';
import ModalPagamento from './ModalConfirmPagamento';

const CODIGO_PAGAMENTO_GENERICO_ESPERADO = 'PGTOOK';

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
    const [garcons, setGarcons] = useState([]);

    const router = useRouter();

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
        // Fetch waiters from API
        fetch('/api/garcons')
            .then(res => res.json())
            .then(data => setGarcons(data.garcons || []))
            .catch(err => console.error('Erro ao buscar garçons:', err));
    }, []);

    const handleConfirmPayment = async ({
        selectedGarconId,
        garconSenha,
        codigoPagamentoGenerico,
        transactionId,
        garconNome
    }) => {
        setConfirmando(true);
        setMensagem({ text: null, type: 'info' });
        setShowWaiterAuthModal(false);

        const payload = {
            mesa: String(mesaId),
            mesa: mesaId,
            amount: totalMesa,
            method: metodoPagamento,
            waiter_name: garconNome,
            waiter_id: selectedGarconId,
            transaction_id: transactionId || null,
            waiter_password: garconSenha,
            clientes: totaisClientes,
        };


        try {
            const res = await fetch('/api/cliente/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(); // Remove mensagem vinda do servidor
            }

            // ✅ Somente limpa os dados se o pagamento foi confirmado com sucesso
            limparPedidos();

            setMensagem({
                text: 'Pagamento confirmado com sucesso! Agradecemos sua visitta e esperamos vê-lo novamente em breve!',
                type: 'success'
            });

            setTimeout(() => router.push('/'), 20000); // Redireciona após 20 s

        } catch (err) {
            console.error("Erro ao confirmar pagamento:", err);
            setMensagem({
                text: 'Não foi possível confirmar o pagamento. Por favor, tente novamente.',
                type: 'error'
            });

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
                                            onClick={() => setShowWaiterAuthModal(true)}
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

            {/* Modal para confirmar pagameto */}
            <ModalPagamento
                show={showWaiterAuthModal}
                onHide={() => setShowWaiterAuthModal(false)}
                onConfirmPayment={handleConfirmPayment}
                garcons={garcons}
                confirming={confirmando}
                metodoPagamento={metodoPagamento}
                totalMesa={totalMesa}
                mesaId={mesaId}
            />
        </div>
    );
}