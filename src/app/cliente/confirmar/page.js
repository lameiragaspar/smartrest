'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import style from './Confirmar.module.css';
import { getPedidos, limparPedidos, removerProdutoTemp } from '../pedido_temp';

export default function ConfirmarPage() {
    const [pedidosPorCliente, setPedidosPorCliente] = useState({});
    const router = useRouter();
    const categoriasMap = {
        "1": 'Todas',
        "2": 'Lanches',
        "3": 'Massas',
        "4": 'Pratos Principais',
        "5": 'Entradas',
        "6": 'Sobremesas',
        "7": 'Bebidas'
    };


    useEffect(() => {
        const pedidosTemporarios = getPedidos();
        const agrupados = {};

        pedidosTemporarios.forEach(pedido => {
            if (!agrupados[pedido.clienteId]) {
                agrupados[pedido.clienteId] = {
                    nome: pedido.nomeCliente || `#${pedido.clienteId}`,
                    pedidos: {}
                };
            }

            for (const categoria in pedido.pedidos) {
                if (!agrupados[pedido.clienteId].pedidos[categoria]) {
                    agrupados[pedido.clienteId].pedidos[categoria] = [];
                }
                agrupados[pedido.clienteId].pedidos[categoria].push(...pedido.pedidos[categoria]);
            }
        });

        setPedidosPorCliente(agrupados);
    }, []);

    const calcularTotal = (cliente) => {
        let total = 0;
        Object.values(cliente.pedidos).forEach(produtos => {
            produtos.forEach(p => {
                total += parseFloat(p.price || 0) * (p.quantidade || 1);
            });
        });
        return total.toFixed(2);
    };


    const enviarPedidos = async () => {
        const mesa = localStorage.getItem('mesa');
        const total = localStorage.getItem('total')
        if (!mesa || Object.keys(pedidosPorCliente).length === 0) return;

        const payload = { [mesa]: pedidosPorCliente };

        try {
            const res = await fetch('/api/pedido/adicionar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                //limparPedidos(); // << AQUI: limpa os pedidos temporários da memória
                localStorage.removeItem('pedidos');
                router.push('/cliente/finalizado');
            } else {
                alert('Erro ao enviar pedidos');
            }
        } catch (err) {
            console.error('Erro:', err);
        }
    };

    if (Object.keys(pedidosPorCliente).length === 0) {
        return (
            <div className={`d-flex flex-column align-items-center justify-content-center ${style.semPedidos}`}>
                <h4 className="text-white mb-3">Nenhum pedido foi iniciado ainda</h4>
                <p className="text-light mb-4 text-center" style={{ maxWidth: '400px' }}>
                    Parece que você ainda não adicionou nenhum item ao seu pedido. Navegue pelo cardápio e escolha seus pratos favoritos!
                </p>
                <button
                    className="btn btn-warning"
                    onClick={() => router.back()}
                >
                    ← Voltar ao Cardápio
                </button>
            </div>
        );
    }

    return (
        <div className={`container ${style.container}`}>
            <h2 className="text-center mb-4 text-white">Confirme seus Pedidos</h2>

            {Object.entries(pedidosPorCliente).map(([clienteId, cliente]) => (
                <div key={clienteId} className={style.cardCliente}>
                    <h5>Cliente: {cliente.nome} </h5>

                    {Object.entries(cliente.pedidos).map(([categoria, produtos]) => (
                        <div key={categoria} className="mb-3">
                            <h6 className="text-white">{categoriasMap[Number(categoria)] || categoria}</h6>
                            <ul className="list-group">
                                {produtos.map((p, i) => (
                                    <li key={i} className={`list-group-item ${style.listCardProdutos}`}>
                                        <div className={`d-flex justify-content-between align-items-center ${style.cardProduto}`}>
                                            <div>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={p.quantidade || 1}
                                                    className="form-control form-control-sm d-inline-block ms-2"
                                                    style={{ width: '60px', marginRight: '30px', textAlign: 'center' }}
                                                    onChange={(e) => {
                                                        const novaQtd = parseInt(e.target.value) || 1;
                                                        setPedidosPorCliente(prev => {
                                                            const novo = { ...prev };
                                                            novo[clienteId].pedidos[categoria][i].quantidade = novaQtd;
                                                            return { ...novo };
                                                        });
                                                    }}
                                                />
                                                <span>{p.name} - Kz {Number(p.price).toFixed(2)}</span>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    removerProdutoTemp(clienteId, categoria, i);
                                                    setPedidosPorCliente(() => {
                                                        const atualizados = getPedidos().reduce((map, p) => {
                                                            if (!map[p.clienteId]) {
                                                                map[p.clienteId] = {
                                                                    nome: p.nomeCliente,
                                                                    pedidos: {}
                                                                };
                                                            }
                                                            for (const cat in p.pedidos) {
                                                                if (!map[p.clienteId].pedidos[cat]) {
                                                                    map[p.clienteId].pedidos[cat] = [];
                                                                }
                                                                map[p.clienteId].pedidos[cat].push(...p.pedidos[cat]);
                                                            }
                                                            return map;
                                                        }, {});
                                                        return atualizados;
                                                    });
                                                }}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    ))}
                    <p className="mt-2 fw-bold text-light">
                        Total: Kz {calcularTotal(cliente)}
                    </p>

                    <button
                        className={`btn btn-sm btn-outline-warning ${style.adicionarBtn}`}
                        onClick={() => router.push(`/cliente/cardapio?cliente=${clienteId}`)}
                    >
                        Adicionar mais
                    </button>
                </div>
            ))}

            <div className={style.botaoFlutuante}>
                <button className={`btn btn-success ${style.confirmarBtn}`} onClick={enviarPedidos}>
                    Confirmar e Enviar Pedido
                </button>
            </div>
        </div>
    );
}
