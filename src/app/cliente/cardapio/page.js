'use client';

import { useEffect, useMemo, useState } from 'react';
import Animate from '@/components/Motion';
import Spinner from 'react-bootstrap/Spinner';
import styles from './cardapio.module.css';
import Pagination from '@/components/Pagination';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Modal, Button } from 'react-bootstrap';
import CardItem from './CardItem';
import MensagensBoasVindas from './MensagensBoasVindas';
import { adicionarOuAtualizarPedido } from '../pedido_temp';

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
      fetch(`/api/cliente/clientes?mesa=${mesa}`)
        .then(res => res.json())
        .then(data => setClientes(data))
        .catch(err => console.error('Erro ao carregar clientes:', err));
    }
  }, [mesa]);

  useEffect(() => {
    async function fetchProdutos() {
      setCarregando(true);
      try {
        const res = await fetch(`/api/cliente/cardapio?categoria=0`); // Carrega todos uma vez só
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setCarregando(false);
      }
    }
    fetchProdutos();
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const abrirModal = (produto) => {
    if (clientes.length === 1) {
      adicionarPedido(clientes[0].id, produto);
    } else {
      setProdutoSelecionado(produto);
      setMostrarModal(true);
    }
  };

  const adicionarPedido = (clienteId, produto) => {
    const nomeCliente = clientes.find(c => c.id === Number(clienteId))?.name || '';

    const resultado = adicionarOuAtualizarPedido({
      mesa,
      clienteId,
      nomeCliente,
      produto
    });

    if (!resultado) {
      console.error('Erro: resultado inválido ao adicionar pedido');
      return;
    }

    setMostrarModal(false);
    setShowToast(true);
  };

  const produtosFiltrados = useMemo(() => (
    categoriaSelecionada === '0'
      ? produtos
      : produtos.filter(p => p.category_id?.toString() === categoriaSelecionada)
  ), [produtos, categoriaSelecionada]);

  const totalPaginas = Math.ceil(produtosFiltrados.length / CARD_POR_PAGINA);
  const indexInicio = (paginaAtual - 1) * CARD_POR_PAGINA;
  const produtosPaginados = useMemo(() => (
    produtosFiltrados.slice(indexInicio, indexInicio + CARD_POR_PAGINA)
  ), [produtosFiltrados, indexInicio]);

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
        <MensagensBoasVindas />

        <div className="mb-4 text-center">
          <div className="d-none d-md-flex justify-content-center flex-wrap gap-2">
            {categorias.map(cat => (
              <button
                key={cat.id}
                className={`btn btn-sm px-4 py-2 fw-bold rounded-pill shadow-sm transition-all ${categoriaSelecionada === cat.id ? 'btn-warning text-dark' : 'btn-outline-light'
                  }`}
                style={{ minWidth: '120px' }}
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

        {produtos.length === 0 ? (
          <div className="text-center my-5">
            <img src="/img/illustrations/no-courses.svg" alt="Sem produtos" style={{ maxWidth: '300px' }} className="mb-3" />
            <h5 className="mb-2 text-white">🍽️ Nenhum produto encontrado</h5>
            <p className="text-secondary text-white">O cardápio está vazio no momento. Por favor, aguarde atualizações.</p>
          </div>
        ) : (
          <div className="row">
            {produtosPaginados.map((produto, index) => (
              <CardItem
                key={produto.id}
                produto={produto}
                index={index}
                mesa={mesa}
                abrirModal={abrirModal}
              />
            ))}
          </div>
        )}

        <div className={styles.botaoFlutuante}>
          <button className="btn btn-success btn-lg shadow" onClick={() => router.push('/cliente/confirmar')}>
            Iniciar Conta
          </button>
        </div>

        <Pagination totalPages={totalPaginas} currentPage={paginaAtual} setCurrentPage={setPaginaAtual} />

        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
          <Modal.Header closeButton className="bg-warning text-dark">
            <Modal.Title>Adicionar Pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <p className="fw-bold">Produto: {produtoSelecionado?.name}</p>
            <div className="mb-3">
              <label className="form-label">Escolha o cliente:</label>
              <select className="form-select" value={clienteSelecionado} onChange={e => setClienteSelecionado(e.target.value)}>
                <option value="">Selecione</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="warning"
              disabled={!clienteSelecionado}
              onClick={() => adicionarPedido(clienteSelecionado, produtoSelecionado)}
            >
              Adicionar Pedido
            </Button>
          </Modal.Footer>
        </Modal>

        {showToast && <div className={styles.toast}>✅ Pedido adicionado!</div>}
      </div>
    </Animate>
  );
}