'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import style from './Confirmar.module.css';

export default function ConfirmarPage() {
    const [pedidosPorCliente, setPedidosPorCliente] = useState({});
    const router = useRouter();

    useEffect(() => {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || {};
        const mesa = localStorage.getItem('mesa');

        // garante que os dados estejam organizados como: { mesa: { clienteId: [...] } }
        if (mesa && pedidos[mesa]) {
            setPedidosPorCliente(pedidos[mesa]);
        }
    }, []);

    const enviarPedidos = async () => {
        const mesa = localStorage.getItem('mesa');
        if (!mesa || Object.keys(pedidosPorCliente).length === 0) return;

        const payload = {
            [mesa]: pedidosPorCliente
        };

        try {
            const res = await fetch('/api/pedido/enviar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
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
        return <p className="text-center mt-5 text-white">Nenhum pedido encontrado.</p>;
    }

    return (
        <div className={`container ${style.container}`}>
            <h2 className="text-center mb-4 text-white">Confirme seus Pedidos</h2>

            {Object.entries(pedidosPorCliente).map(([clienteId, cliente]) => (
                <div key={clienteId} className={style.cardCliente}>
                    <h5>{cliente.nome ? `Cliente ${cliente.nome}` : `Cliente #${clienteId}`}</h5>
                    <ul>
                        {(cliente.produtos || []).map((p, i) => (
                            <li key={i}>{p.name} - Kz {Number(p.price).toFixed(2)}</li>
                        ))}
                    </ul>
                    <button
                        className={`btn btn-sm btn-outline-warning ${style.adicionarBtn}`}
                        onClick={() => router.push(`/cliente/cardapio?cliente=${clienteId}`)}
                    >
                        Adicionar mais
                    </button>
                </div>
            ))}



            <div className="text-center mt-4">
                <button className={`btn btn-success ${style.confirmarBtn}`} onClick={enviarPedidos}>
                    Confirmar e Enviar Pedido
                </button>
            </div>
        </div>
    );
}
