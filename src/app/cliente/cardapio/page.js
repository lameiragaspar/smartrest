'use client';

import { useEffect, useState } from 'react';
import Animate from '@/components/Motion';
import Spinner from 'react-bootstrap/Spinner';
import { inView } from 'framer-motion';
import style from '../cliente.module.css'
import Pagination from '@/components/Pagination';

export default function CardapioPage() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mesa, setMesa] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('0'); // 0 = Todas
  const [paginaAtual, setPaginaAtual] = useState(1);
  const CardPorPagina = 9;

  const categorias = [
  { id: '0', nome: 'Todas' },
  { id: '1', nome: 'Lanches' },
  { id: '2', nome: 'Massas' },
  { id: '3', nome: 'Pratos Principais' },
  { id: '4', nome: 'Entradas' },
  { id: '5', nome: 'Sobremesas' },
  { id: '6', nome: 'Bebidas' }
];

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
      } finally {
        setCarregando(false);
      }
    }

    fetchProdutos();
  }, []);

    const produtosFiltrados = categoriaSelecionada === '0'
  ? produtos
  : produtos.filter(p => p.category_id?.toString() === categoriaSelecionada);

const totalPaginas = Math.ceil(produtosFiltrados.length / CardPorPagina);
const indexInicio = (paginaAtual - 1) * CardPorPagina;
const produtosPaginados = produtosFiltrados.slice(indexInicio, indexInicio + CardPorPagina);


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
        <div className="mb-4 text-center">
          {/* Botões (Desktop) */}
          <div className="d-none d-md-flex justify-content-center flex-wrap gap-2">
            {categorias.map(cat => (
              <button
                key={cat.id}
                className={`btn btn-sm ${categoriaSelecionada === cat.id ? 'btn-warning' : 'btn-outline-light'}`}
                onClick={() => {
                  setCategoriaSelecionada(cat.id);
                  setPaginaAtual(1); // reinicia a paginação
                }}
              >
                {cat.nome}
              </button>
            ))}
          </div>

          {/* Select (Mobile) */}
          <div className="d-md-none">
            <select
              className="form-select"
              value={categoriaSelecionada}
              onChange={(e) => {
                setCategoriaSelecionada(e.target.value);
                setPaginaAtual(1);
              }}
            >
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center my-5">
            <img
              src="/img/illustrations/no-courses.svg"
              alt="Sem produtos"
              style={{ maxWidth: '300px' }}
              className="mb-3"
            />
            <h5 className="mb-2 text-white">🍽️ Nenhum produto encontrado</h5>
            <p className="text-secondary text-white">O cardápio está vazio no momento. Por favor, aguarde atualizações.</p>
          </div>
        ) : (
          <div className="row">
            {produtosPaginados.map((produto) => (
              <div className="col-md-6 col-lg-4 mb-4" key={produto.id}>
                <div className="card h-100 bg-dark text-white shadow-lg border-0 rounded-4 overflow-hidden">
                  {produto.image_url && (
                    <img
                      src={`img/${produto.imagem}`}
                      alt={produto.name}
                      className="card-img-top"
                      style={{ height: 200, objectFit: 'cover', borderBottom: '4px solid #ffc107' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">
                      {produto.name} <span className={style.numMesa}>#{mesa}</span>
                    </h5>
                    <p className="card-text text-secondary flex-grow-1">{produto.description}</p>
                    <div className="mt-3">
                      <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill">
                        Kz {Number(produto.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination
          totalPages={totalPaginas}
          currentPage={paginaAtual}
          setCurrentPage={setPaginaAtual}
      />
    </Animate>
  );
}

