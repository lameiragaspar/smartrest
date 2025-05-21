'use client';

import { useEffect, useState } from 'react';
import Animate from '@/components/Motion';
import Spinner from 'react-bootstrap/Spinner';
import styles from './cardapio.module.css';
import style from '../cliente.module.css';
import Pagination from '@/components/Pagination';
import { FaCartPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';

export default function CardapioPage() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mesa, setMesa] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('0');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [clientes, setClientes] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const router = useRouter();

  const CARD_POR_PAGINA = 9;

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
    if (mesa) {
      fetch(`/api/clientes?mesa=${mesa}`)
        .then(res => res.json())
        .then(data => setClientes(data))
        .catch(err => console.error('Erro ao carregar clientes:', err));
    }
  }, [mesa]);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch(`/api/cardapio?categoria=${categoriaSelecionada}`);
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setCarregando(false);
      }
    }
    fetchProdutos();
  }, [categoriaSelecionada]);

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setMostrarModal(true);
  };

  const mostrarToastTemporario = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const adicionarPedido = (mesa, clienteId, produto, nomeCliente) => {
    const dados = JSON.parse(localStorage.getItem('pedidos')) || {};

    if (!dados[mesa]) dados[mesa] = {};

    if (!dados[mesa][clienteId]) {
      dados[mesa][clienteId] = {
        nome: nomeCliente || '',
        produtos: []
      };
    }

    if (!Array.isArray(dados[mesa][clienteId].produtos)) {
      dados[mesa][clienteId].produtos = [];
    }

    dados[mesa][clienteId].produtos.push(produto);
    localStorage.setItem('pedidos', JSON.stringify(dados));
    mostrarToastTemporario();
    setMostrarModal(false);
  };




  const produtosFiltrados = categoriaSelecionada === '0'
    ? produtos
    : produtos.filter(p => p.category_id?.toString() === categoriaSelecionada);

  const totalPaginas = Math.ceil(produtosFiltrados.length / CARD_POR_PAGINA);
  const indexInicio = (paginaAtual - 1) * CARD_POR_PAGINA;
  const produtosPaginados = produtosFiltrados.slice(indexInicio, indexInicio + CARD_POR_PAGINA);

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

        {/* Filtro por categoria */}
        <div className="mb-4 text-center">
          <div className="d-none d-md-flex justify-content-center flex-wrap gap-2">
            {categorias.map(cat => (
              <button
                key={cat.id}
                className={`btn btn-sm ${categoriaSelecionada === cat.id ? 'btn-warning' : 'btn-outline-light'}`}
                onClick={() => {
                  setCategoriaSelecionada(cat.id);
                  setPaginaAtual(1);
                }}
              >
                {cat.nome}
              </button>
            ))}
          </div>
          <div className="d-md-none">
            <select
              className="form-select"
              value={categoriaSelecionada}
              onChange={e => {
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

        {/* Produtos */}
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
            {produtosPaginados.map(produto => (
              <div className="col-md-6 col-lg-4 mb-4" key={produto.id}>
                <div className={`card h-100 bg-dark text-white shadow-lg border-0 rounded-4 overflow-hidden ${styles.card}`}>

                  {produto.image_url && (
                    <img
                      src={produto.image_url.startsWith('http') ? produto.image_url : `/img/${produto.image_url}`}
                      alt={produto.name}
                      className="card-img-top"
                      style={{ height: 200, objectFit: 'cover', borderBottom: '4px solid #ffc107' }}
                    />
                  )}

                  <div className="card-body d-flex flex-column">
                    <h5 className={`card-title fw-bold ${styles.cardTitle}`}>
                      {produto.name} <span className={style.numMesa}>#{mesa}</span>
                    </h5>
                    <p className="card-text text-secondary flex-grow-1">{produto.description}</p>
                    <div className="mt-3">
                      <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill">
                        Kz {Number(produto.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 end-0 m-3">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Adicionar ao pedido</Tooltip>}
                      >
                        <button
                          className={`btn btn-warning btn-sm shadow rounded-circle ${styles.carrinhoBtn}`}
                          onClick={() => abrirModal(produto)}
                        >
                          <FaCartPlus size={20} />
                        </button>
                      </OverlayTrigger>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão Flutuante */}
        <div className={style.botaoFlutuante}>
          <button className="btn btn-success btn-lg shadow" onClick={() => router.push('/cliente/confirmar')}>
            Iniciar Conta
          </button>
        </div>

        {/* Paginação */}
        <Pagination totalPages={totalPaginas} currentPage={paginaAtual} setCurrentPage={setPaginaAtual} />

        {/* Modal de Adição */}
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="fw-bold">Produto: {produtoSelecionado?.name}</p>
            <div className="mb-3">
              <label className="form-label">Escolha o cliente:</label>
              <select
                className="form-select"
                value={clienteSelecionado}
                onChange={e => setClienteSelecionado(e.target.value)}
              >
                <option value="">Selecione</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="warning"
              disabled={!clienteSelecionado}
              onClick={async () => {
                adicionarPedido(clienteSelecionado, produtoSelecionado);
                {/*try {
                  await fetch('/api/pedido/adicionar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      produto_id: produtoSelecionado.id,
                      cliente_id: clienteSelecionado,
                      mesa
                    })
                  });

                } catch (err) {
                  alert('Erro ao adicionar pedido.');
                } finally {
                  setMostrarModal(false);
                }*/}
              }}
            >
              Adicionar Pedido
            </Button>
          </Modal.Footer>
        </Modal>
        {
          showToast && (
            <div className={styles.toast}>✅ Pedido adicionado!</div>
          )
        }
      </div>
    </Animate>
  );
}
