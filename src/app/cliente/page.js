'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './cliente.module.css';

export default function ClientePage() {
  const [mesa, setMesa] = useState('');
  const router = useRouter();

  useEffect(() => { 
    //Verica se há mesa salva na memória do navegador
    const mesaSalva = localStorage.getItem('mesa');
    if (mesaSalva) {
      router.push('/cliente/quantidade');
    }
  }, []);

  const handleSalvarMesa =  async () => {
    if (!mesa || isNaN(mesa) || parseInt(mesa) <= 0) {
      alert('Digite um número de mesa válido!');
      return;
    }
    if(parseInt(mesa) >= 10){
      alert('Limite máximo de 10 mesas no restaurante!');
      return;
    }
    //Salva a mesa na memória do navegar
    localStorage.setItem('mesa', mesa);

    const res = await fetch('/api/mesa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mesa }),
    });
    if (res.ok) {
      router.push('/cliente/quantidade');
    } else {
      alert('Erro ao salvar númedo da mesa');
    }
  };

  return (
    <div className={`d-flex align-items-center justify-content-center `}>
      <div className="bg-dark text-white p-5 rounded shadow-lg text-center" style={{ maxWidth: 480, width: '100%' }}>
        <h2 className="mb-4">Configuração inícial</h2>
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
        <button className="btn btn-warning px-4 w-100 fw-bold rounded-pill" onClick={handleSalvarMesa}>
          Confirmar
        </button>
      </div>
    </div>
  );
}
