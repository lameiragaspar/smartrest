'use client';

import { useEffect, useState } from 'react';

export default function CardapioPage() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch('/api/cardapio');
        const data = await res.json();
        console.log('Produtos recebidos:', data); // Verifique os dados aqui
        setProdutos(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      }
    }

    fetchProdutos();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Cardápio</h2>

      <div className="row">
        {produtos.length === 0 ? (
          <p className="text-center">Nenhum produto encontrado</p>
        ) : (
          produtos.map((produto) => (
            <div className="col-md-4 mb-4" key={produto.id}>
              <div className="card h-100 shadow-sm">
                {produto.imagem && (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="card-img-top"
                    style={{ maxHeight: 200, objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{produto.nome}</h5>
                  <p className="card-text">{produto.descricao}</p>
                  <p className="card-text fw-bold">Kz {Number(produto.preco).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

