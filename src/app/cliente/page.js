'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from 'react-bootstrap';
import styles from './cliente.module.css';

export default function ClientePage() {
  const [mesa, setMesa] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [bloqueado, setBloqueado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Aguarda o carregamento do client para verificar o localStorage
    const verificarMesa = () => {
      const mesaSalva = localStorage.getItem('mesa');
      if (mesaSalva) {
        router.push('/cliente/quantidade');
      } else {
        setCarregando(false); // Só mostra a página se não houver mesa salva
      }
    };

    // Garante que o localStorage esteja disponível
    if (typeof window !== 'undefined') {
      verificarMesa();
    }
  }, []);

  const handleSalvarMesa = async () => {
    setBloqueado(true);
    setCarregando(true);
    if (!mesa || isNaN(mesa) || parseInt(mesa) <= 0) {
      alert('Digite um número de mesa válido!');
      setCarregando(false);
      return;
    }
    if (parseInt(mesa) >= 10) {
      setCarregando(false);
      alert('Limite máximo de 10 mesas no restaurante!');
      return;
    }

    localStorage.setItem('mesa', mesa);

    const res = await fetch('/api/cliente/mesa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mesa }),
    });

    if (res.ok) {
      router.push('/cliente/quantidade');
    } else {
      setCarregando(false);
      alert('Erro ao salvar número da mesa');
    }
  };
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
        <>
          <h3 className='display-4 mb-4 fw-bold text-warning'>Configuração inícial</h3>
          <div className="d-flex align-items-center justify-content-center">
            <div className="bg-dark text-white p-5 rounded shadow-lg text-center" style={{ maxWidth: 480, width: '100%' }}>
              <h4 className="mb-4">Informe o número da mesa</h4>
              <input
                type="number"
                className={`form-control mb-3 bg-dark text-white border-secondary ${styles.inputCustom}`}
                value={mesa}
                min={1}
                max={10}
                onChange={(e) => setMesa(e.target.value)}
                placeholder="Ex: 12"
              />
              <button className="btn btn-warning px-4 w-100 fw-bold rounded-pill" 
              onClick={handleSalvarMesa}
              disabled={bloqueado}>
                Confirmar
              </button>
            </div>
          </div>
        </>)}
    </>
  );
}
