'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientePage() {
  const [mesa, setMesa] = useState('');
  const router = useRouter();

  useEffect(() => {
    const mesaSalva = localStorage.getItem('mesa');
    if (mesaSalva) {
      // Se já tiver mesa salva, redireciona direto pro cardápio
      router.push('/cliente/cardapio');
    }
  }, []);

  const handleSalvar = () => {
    if (!mesa || isNaN(mesa)) {
      alert('Digite um número válido de mesa.');
      return;
    }

    localStorage.setItem('mesa', mesa);
    router.push('/cliente/cardapio');
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Informe o número da mesa</h2>
      <input
        type="number"
        className="form-control mb-3 w-50 mx-auto"
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
        placeholder="Ex: 12"
      />
      <button className="btn btn-primary" onClick={handleSalvar}>
        Confirmar
      </button>
    </div>
  );
}
