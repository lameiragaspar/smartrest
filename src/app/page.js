'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Header from '@/components/Header';
import Animate from '@/components/Motion';

export default function Home() {
  const router = useRouter()
  const [mesa, setMesa] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const mesaStorage = localStorage.getItem('mesa');
    setMesa(mesaStorage);
  }, []);

  const handleCliente = () => {
    setBloqueado(true);
    setCarregando(true)
    router.push(mesa ? '/cliente/quantidade' : '/cliente');
  };

  const handleAdmin = () => {
    setBloqueado(true);
    setCarregando(true)
    router.push('/login');
  };

  return (
    <div className="app-container">
      <div className="overlay"></div>
      <Header />

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
          <main>
            <div className="d-flex justify-content-center align-items-center text-white text-center">
              <div className="bg-dark bg-opacity-75 rounded-4 p-5 shadow-lg">
                <h1 className="display-4 mb-4 fw-bold">Bem-vindos ao Restaurante</h1>
                <p className="lead mb-5">Escolha seu tipo de acesso para continuar</p>
                <div className="d-flex gap-3 justify-content-center">
                  <button
                    className="btn btn-outline-light btn-lg px-4 rounded-pill"
                    onClick={handleCliente}
                    disabled={bloqueado}
                  >
                    Acessar como Cliente
                  </button>
                  <button
                    className="btn btn-outline-warning btn-lg px-4 rounded-pill"
                    onClick={handleAdmin}
                    disabled={bloqueado}
                  >
                    Acessar como Admin
                  </button>
                </div>
              </div>
            </div>
          </main>
        </Animate>)}
    </div>
  )
}
