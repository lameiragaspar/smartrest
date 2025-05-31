import React, { useState, useEffect } from 'react';
import { getPedidos, limparPedidos } from '../pedido_temp'; // Ajuste o caminho se necessário
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import styles from './pagamento.module.css'; // Importando o CSS Module

// Ícone SVG simples para o cartão (substitua por um da biblioteca se preferir)
const CardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </svg>
);

// Componente ClienteCard (integrado para simplicidade, idealmente em arquivo separado)
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
    const telefone = '+244934557024'; 
    const [pedidos, setPedidos] = useState([]); 
    const [totaisClientes, setTotaisClientes] = useState([]);
    const [totalMesa, setTotalMesa] = useState(0);
    const [isUnicoCliente, setIsUnicoCliente] = useState(false);

    // Estados do componente original
    const [clientesPagos, setClientesPagos] = useState([]); // Manter se houver lógica de pagamento parcial
    const [mensagem, setMensagem] = useState({ text: null, type: 'info' }); // {text, type: 'info' | 'error' | 'success'}
    const [confirmando, setConfirmando] = useState(false);
    const [comprovativo, setComprovativo] = useState(null);
    const [nomeComprovativo, setNomeComprovativo] = useState('');
    const [metodoPagamento, setMetodoPagamento] = useState('cash');

    // Estados para controle dos modais Bootstrap
    const [showModalGarcom, setShowModalGarcom] = useState(false);
    const [showModalQrCodeUnico, setShowModalQrCodeUnico] = useState(false);

    const router = useRouter();

    // Efeito para carregar e processar os pedidos do localStorage
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

    }, []); // Executa uma vez ao montar


    const urlQrCodeTotalMesa = `https://app.appypay.co.ao/qrcode?phone=${telefone}&amount=${totalMesa}&reference=Mesa:${mesaId}-Total`;
    // Para cliente único, o QR Code do modal usará o mesmo totalMesa, pois é o único cliente.
    const urlQrCodeClienteUnico = `https://app.appypay.co.ao/qrcode?phone=${telefone}&amount=${totalMesa}&reference=Mesa:${mesaId}-Cliente:${totaisClientes[0]?.nomeCliente || 'Unico'}`;


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setComprovativo(file);
            setNomeComprovativo(file.name);
            setMensagem({ text: null, type: 'info' }); // Limpa mensagem anterior
        } else {
            setComprovativo(null);
            setNomeComprovativo('');
        }
    };

    const confirmarPagamentoAPI = async () => {
        if (metodoPagamento !== 'cash' && metodoPagamento !== 'mcexpress' && !comprovativo) {
            setMensagem({ text: 'Por favor, envie o comprovativo para este método de pagamento.', type: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('order_id', mesaId);
        formData.append('amount', totalMesa);
        formData.append('method', metodoPagamento);
        if (comprovativo) formData.append('comprovativo', comprovativo);

        setConfirmando(true);
        setMensagem({ text: null, type: 'info' });

        try {
            // Simulação da chamada API, substitua pelo seu fetch real
            // const res = await fetch('../api/finalizar', { // Seu endpoint da API
            //     method: 'POST',
            //     body: formData,
            // });
            // if (!res.ok) {
            //     const errorData = await res.json().catch(() => ({ message: 'Erro na comunicação com o servidor.' }));
            //     throw new Error(errorData.message || `Erro ${res.status} ao finalizar o pedido.`);
            // }
            // const data = await res.json();

            // Simulação de sucesso da API
            await new Promise(resolve => setTimeout(resolve, 1500));
            const data = { mensagem: 'Pagamento processado com sucesso pela API!' };
            // Fim da simulação

            limparPedidos(); // Limpa do localStorage
            setMensagem({ text: data.mensagem || 'Pagamento confirmado com sucesso!', type: 'success' });

            setTimeout(() => {
                router.push('/'); // Ou para uma página de "Obrigado"
            }, 3000);

        } catch (err) {
            console.error("Erro ao confirmar pagamento:", err);
            setMensagem({ text: err.message || 'Erro ao confirmar o pagamento. Tente novamente.', type: 'error' });
        } finally {
            setConfirmando(false);
        }
    };

    // Funções para controlar modais Bootstrap
    const handleShowModalGarcom = () => setShowModalGarcom(true);
    const handleCloseModalGarcom = () => setShowModalGarcom(false);
    const handleShowModalQrCodeUnico = () => setShowModalQrCodeUnico(true);
    const handleCloseModalQrCodeUnico = () => setShowModalQrCodeUnico(false);


    if (pedidos.length === 0 && totalMesa === 0) {
        // Mostra um loader ou mensagem enquanto os pedidos são carregados ou se não houver pedidos
        return (
            <div className={`${styles.pagamentoContainer} container-fluid d-flex justify-content-center align-items-center`}>
                <div className="text-center">
                    <div className={`spinner-border ${styles.loadingSpinner}`} role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="mt-3">Carregando pedidos da mesa...</p>
                    {/* Adicionar uma mensagem se, após o carregamento, não houver pedidos */}
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

                {/* Mensagem de Feedback Global */}
                {mensagem.text && (
                    <div className={`alert ${mensagem.type === 'error' ? styles.alertErro :
                        mensagem.type === 'success' ? styles.alertSucesso :
                            styles.alertInfo
                        } alert-dismissible fade show`} role="alert">
                        {mensagem.text}
                        <button type="button" className="btn-close" onClick={() => setMensagem({ text: null, type: 'info' })} aria-label="Close"></button>
                    </div>
                )}

                <div className="row gx-lg-5">
                    {/* Coluna de Detalhes dos Pedidos dos Clientes */}
                    <div className="col-12 col-lg-7 mb-4 mb-lg-0">
                        <div className={`${styles.cardPrincipal}`}>
                            <div className="card-header text-center py-4">
                                <h4 className="mb-0">Resumo dos Pedidos</h4>
                            </div>
                            <div className="card-body">
                                {totaisClientes.length > 0 ? (
                                    totaisClientes.map((cliente, i) => (
                                        <ClienteCard
                                            key={cliente.clienteId || i} // Usar clienteId se disponível, senão index
                                            cliente={cliente}
                                            isUnicoCliente={isUnicoCliente}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-muted">Nenhum pedido encontrado para esta mesa.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Coluna de Pagamento Total e Ações */}
                    <div className="col-12 col-lg-5">
                        {/* Card Total da Mesa */}
                        <div className={`${styles.cardTotalMesa} mb-4`}>
                            <h5 className="mb-2">Total da Mesa</h5>
                            <p className={`${styles.totalMesaValor}`}>
                                {totalMesa.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                            </p>

                            {/* QR Code para Múltiplos Clientes ou Botão para Cliente Único */}
                            {metodoPagamento === 'mcexpress' && (
                                <div className="mt-3">
                                    {!isUnicoCliente ? (
                                        <>
                                            <div className={`${styles.qrCodeContainer} mx-auto`}>
                                                <QRCode value={urlQrCodeTotalMesa} size={160} level="H" />
                                            </div>
                                            <p className="small text-white mt-2">
                                                Escaneie para pagar o total da mesa com Multicaixa Express.
                                            </p>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleShowModalQrCodeUnico}
                                            className={`btn ${styles.btnAmarelo} w-100`}
                                        >
                                            Pagar com Multicaixa Express (QR Code)
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Botão Chamar Garçom */}
                            {metodoPagamento !== 'mcexpress' && (
                                <div className="mt-3">
                                    <button
                                        onClick={handleShowModalGarcom}
                                        className={`btn ${styles.btnAmarelo} w-100`}
                                    >
                                        Chamar Garçom para Pagamento
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Card Métodos de Pagamento e Confirmação */}
                        {totalMesa > 0 && (
                            <div className={`${styles.cardPrincipal}`}>
                                <div className="card-header text-center py-4"><p className='mb-0'>Finalizar Pagamento</p></div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label htmlFor="metodoPagamento" className={`${styles.formLabel} form-label`}>Método de Pagamento Geral:</label>
                                        <select
                                            id="metodoPagamento"
                                            className={`${styles.formSelect} form-select`}
                                            value={metodoPagamento}
                                            onChange={(e) => {
                                                setMetodoPagamento(e.target.value);
                                                setMensagem({ text: null, type: 'info' });
                                                setComprovativo(null);
                                                setNomeComprovativo('');
                                            }}
                                        >
                                            <option value="cash">Dinheiro</option>
                                            <option value="mcexpress">Multicaixa Express (QR Code)</option>
                                            <option value="transfer">Transferência Bancária</option>
                                            <option value="cartao">Cartão Multicaixa/TPA</option>
                                        </select>
                                    </div>

                                    {(metodoPagamento === 'transfer' || metodoPagamento === 'cartao_offline_placeholder') && ( // Ajuste 'cartao_offline_placeholder' se necessário
                                        <div className="mb-3">
                                            <label htmlFor="comprovativo" className={`${styles.formLabel} form-label`}>
                                                Anexar Comprovativo ({metodoPagamento === 'transfer' ? 'Obrigatório' : 'Opcional'})
                                            </label>
                                            <input
                                                type="file"
                                                id="comprovativo"
                                                accept="image/*,.pdf"
                                                className={`${styles.inputFile} form-control`}
                                                onChange={handleFileChange}
                                            />
                                            {nomeComprovativo && <p className={`${styles.mensagemComprovativo} mt-1`}>Arquivo: {nomeComprovativo}</p>}
                                        </div>
                                    )}

                                    <button
                                        onClick={confirmarPagamentoAPI}
                                        disabled={confirmando || totalMesa === 0}
                                        className={`btn ${styles.btnSucesso} w-100`}
                                    >
                                        {confirmando ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Enviando...
                                            </>
                                        ) : (
                                            'Confirmar Pagamento Total'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Garçom Notificado */}
            <div className={`modal fade ${showModalGarcom ? 'show d-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{ backgroundColor: showModalGarcom ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className={`modal-content ${styles.modalContentCustom}`}>
                        <div className={`modal-header ${styles.modalHeaderCustom}`}>
                            <h5 className="modal-title">✅ Garçom Notificado</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModalGarcom}></button>
                        </div>
                        <div className="modal-body">
                            <p>O garçom foi informado para vir à sua mesa. Por favor, aguarde um momento.</p>
                        </div>
                        <div className={`modal-footer ${styles.modalFooterCustom}`}>
                            <button type="button" className={`btn ${styles.btnAmarelo}`} onClick={handleCloseModalGarcom}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal QR Code para Cliente Único */}
            {isUnicoCliente && (
                <div className={`modal fade ${showModalQrCodeUnico ? 'show d-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{ backgroundColor: showModalQrCodeUnico ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className={`modal-content ${styles.modalContentCustom}`}>
                            <div className={`modal-header ${styles.modalHeaderCustom}`}>
                                <h5 className="modal-title">Pagar com Multicaixa Express</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModalQrCodeUnico}></button>
                            </div>
                            <div className="modal-body text-center">
                                <p className="mb-2">Escaneie o QR Code abaixo para pagar:</p>
                                <p className={`${styles.totalMesaValor} mb-3`}>
                                    {totalMesa.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                                </p>
                                <div className={`${styles.qrCodeContainer} mx-auto`}>
                                    <QRCode value={urlQrCodeClienteUnico} size={200} level="H" />
                                </div>
                                <p className="small text-muted mt-2">Referência: Mesa:{mesaId}-Cliente</p>
                            </div>
                            <div className={`modal-footer ${styles.modalFooterCustom}`}>
                                <button type="button" className={`btn ${styles.btnOutlineLight}`} onClick={handleCloseModalQrCodeUnico}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
