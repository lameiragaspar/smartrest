'use client';

import { useEffect, useState } from 'react';
import Animate from '@/components/Motion';
import Spinner from 'react-bootstrap/Spinner';
import style from '../cliente.module.css'

export default function CardapioPage() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mesa, setMesa] = useState(null);
  
  useEffect(() => {
    const mesaStorage = localStorage.getItem('mesa');
    setMesa(mesaStorage);
  }, []);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch('/api/cardapio');
        const data = await res.json();
        //console.log('Produtos recebidos:', data); // Verifique os dados aqui
        setProdutos(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      }finally {
        setCarregando(false);
      }
    }

    fetchProdutos();
  }, []);
  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }
  return (
    <Animate>
    <div className="container mt-4">
      <h2 className="text-center mb-4">Cardápio</h2>
      <div className="row">
        {produtos.length === 0 ? (
          <p className="text-center text-light">Nenhum produto encontrado</p>
        ) : (
          produtos.map((produto) => (
            <div className="col-md-6 col-lg-4 mb-4" key={produto.id}>
              <div className="card h-100 bg-dark text-white shadow-lg border-0 rounded-4 overflow-hidden">
                {produto.imagem && (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="card-img-top"
                    style={{ height: 200, objectFit: 'cover', borderBottom: '4px solid #ffc107' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{produto.nome} <span className={style.numMesa}>#{mesa}</span></h5>
                  <p className="card-text text-secondary flex-grow-1">{produto.descricao}</p>
                  <div className="mt-3">
                    <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill">
                      Kz {Number(produto.preco).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </Animate>
  );
}

