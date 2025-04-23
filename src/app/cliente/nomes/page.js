'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import Animate from '@/components/Motion';
import styles from '../cliente.module.css'

export default function NomesPage() {
  const [quantidade, setQuantidade] = useState(0);
  const [nomes, setNomes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const mesa = localStorage.getItem('mesa');
    if (!mesa) {
      alert('Mesa não configurada!');
      router.push('/cliente');
      return;
    }

    async function buscarQuantidade() {
      try {
        const res = await fetch(`/api/quantnomes?mesa=${mesa}`);
        const data = await res.json();
        if (res.ok && data.quantidade_pessoas) {
          setQuantidade(data.quantidade_pessoas);
          setNomes(Array.from({ length: data.quantidade_pessoas }, () => ''));
        } else {
          alert('Erro ao buscar quantidade da mesa');
        }
      } catch (error) {
        console.error(error);
        alert('Erro na comunicação com o servidor.');
      } finally {
        setCarregando(false);
      }
    }

    buscarQuantidade();
  }, [router]);

  const handleNomeChange = (index, valor) => {
    const novosNomes = [...nomes];
    novosNomes[index] = valor;
    setNomes(novosNomes);
  };

  const salvarNomes = async () => {
    const mesa = localStorage.getItem('mesa');
    if (!mesa) return;

    const nomesValidos = nomes.filter((nome) => nome.trim().length > 0);
    if (nomesValidos.length < quantidade) {
      alert('Preencha todos os nomes.');
      return;
    }

    const res = await fetch('/api/nomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mesa, nomes: nomesValidos }),
    });

    if (res.ok) {
      router.push('/cliente/cardapio');
    } else {
      alert('Erro ao salvar nomes');
    }
  };

  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  const mensagem = quantidade === 1 ? "Informe seu nome" : `Informe os nomes dos ${quantidade} clientes`

  return (
    <>
      {carregando ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
          <Spinner animation="border" />
        </div>
      ) : (
        <Animate>
          <div className="container d-flex align-items-center justify-content-center">
            <div className="row w-100 justify-content-center">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="p-4 rounded-4 shadow-lg bg-dark bg-opacity-75">
                  <h4 className="text-center mb-4">{mensagem}</h4>
                  {nomes.map((nome, index) => {
                    const label = quantidade === 1 ? 'Nome' : `${index + 1}º Cliente`;
                    return (
                      <div className="mb-3" key={index}>
                        <label className="form-label text-light">{label}</label>
                        <input
                          type="text"
                          className={`form-control bg-dark text-white border-secondary ${styles.inputCustom}`}
                          placeholder={`nome..*`}
                          value={nome}
                          onChange={(e) => handleNomeChange(index, e.target.value)}
                        />
                      </div>
                    );
                  })}
                  <button className="btn btn-warning w-100 fw-bold rounded-pill mt-2" onClick={salvarNomes}>
                    Confirmar Nomes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Animate>
      )}
    </>
  );
  
}
