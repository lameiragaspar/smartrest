'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from 'react-bootstrap';
import Animate from '@/components/Motion';
import styles from '../cliente.module.css'

export default function NomesPage() {
  const [quantidade, setQuantidade] = useState(0);
  const [nomes, setNomes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [bloqueado, setBloqueado] = useState(false);
  const [mesa, setMesa] = useState('')
  const router = useRouter();

  useEffect(() => {
    const mesa = localStorage.getItem('mesa');
    if (!mesa) {
      alert('Mesa não configurada!');
      router.push('/cliente');
      return;
    }
    setMesa(mesa)
    async function buscarQuantidade() {
      try {
        const res = await fetch(`/api/cliente/buscaquantidade?mesa=${mesa}`);
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
    setBloqueado(true)
    setCarregando(true)
    const mesa = localStorage.getItem('mesa');
    if (!mesa) return;

    const nomesValidos = nomes.filter((nome) => nome.trim().length > 0);
    if (nomesValidos.length < quantidade) {
      setCarregando(false)
      alert('Preencha todos os nomes.');
      return;
    }

    try {
      const res = await fetch('/api/cliente/nomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesa, nomes: nomesValidos }),
      });

      if (res.ok) {
        router.push('/cliente/cardapio');
      } else {
        setCarregando(false)
        alert('Erro ao salvar nomes');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  const mensagem = quantidade === 1 ? "Por favor, informe seu nome" : `Por favor, informe os nomes dos ${quantidade} clientes`

  return (
    <>
      {carregando ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center text-warning"
          style={{ minHeight: '70vh' }}
        >
          <Spinner animation="border" className="mb-2" />
          <p className="mb-0">Carregando informações...</p>
        </div>

      ) : (
        <Animate>
          <h3 className="display-4 mb-4 fw-bold">Bem-vindos a Mesa <span className='text-warning'>#{mesa}</span> </h3>
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
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.includes(' ')) {
                              const [primeiroNome, ...resto] = value.split(' ');
                              handleNomeChange(index, primeiroNome);

                              // Focar o próximo input ou botão
                              setTimeout(() => {
                                const elementosFocaveis = document.querySelectorAll(
                                  'input.form-control, button'
                                );
                                const atual = elementosFocaveis[index];
                                const proximo = elementosFocaveis[index + 1];
                                if (proximo) proximo.focus();
                              }, 0);
                            } else {
                              handleNomeChange(index, value);
                            }
                          }}
                        />

                      </div>
                    );
                  })}
                  <button className="btn btn-warning w-100 fw-bold rounded-pill mt-2"
                    onClick={salvarNomes}
                    disabled={bloqueado}>
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