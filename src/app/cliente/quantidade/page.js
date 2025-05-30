'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Animate from '@/components/Motion';

export default function QuantidadePessoasPage() {
  const [quantidade, setQuantidade] = useState('');
  const router = useRouter();

  const [mesa, setMesa] = useState(null);

  useEffect(() => {
    //Verica se há mesa salva na memória do navegador
    const mesaStorage = localStorage.getItem('mesa');
    if(!mesaStorage){
      router.push('/cliente')
    }else{
      setMesa(mesaStorage);
    }
  }, []);

  const handleSalvarQuatidade = async () => {

    if (!quantidade || parseInt(quantidade) <= 0) {
      alert('Digite uma quantidade válida');
      return;
    }
    if(parseInt(quantidade) >= 10){
      alert('Limite máximo de 10 pessoas por mesa');
      return;
    }

    // Envia para API
    const res = await fetch(`/api/cliente/insetquantidade?table=${mesa}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantidade }),
    });

    if (res.ok) {
      router.push('/cliente/nomes');
    } else {
      alert('Erro ao registrar número de pessoas');
    }
  };

  return (
    <div className="container mt-4 text-center">
      <Animate>
      <h3 className="display-4 mb-4 fw-bold">Bem-vindos a Mesa {mesa} </h3>
      <div className="container d-flex align-items-center justify-content-center ">
        <div className="bg-dark bg-opacity-75 rounded-4 p-5 shadow-lg text-center">
          <h2 className="mb-4 text-white">Quantas pessoas há na mesa?</h2>
          <input
            type="number"
            className="form-control mb-3"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Ex: 4"
            min={1}
            max={10}
          />
          <button className="btn btn-warning w-100 fw-bold rounded-pill" onClick={handleSalvarQuatidade}>
            Continuar
          </button>
        </div>
      </div>
      </Animate>
    </div>
  );
}
