'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter()
  const [mesa, setMesa] = useState(null);
  
  useEffect(() => {
    const mesaStorage = localStorage.getItem('mesa');
    setMesa(mesaStorage);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center text-white text-center">
      <div className="bg-dark bg-opacity-75 rounded-4 p-5 shadow-lg">
        <h1 className="display-4 mb-4 fw-bold">Bem-vindos ao Restaurante</h1>
        <p className="lead mb-5">Escolha seu tipo de acesso para continuar</p>
        <div className="d-flex gap-3 justify-content-center">
          <button
            className="btn btn-outline-light btn-lg px-4 rounded-pill"
            onClick={() => router.push(mesa ? '/cliente/quantidade' : '/cliente')}
          >
            Acessar como Cliente
          </button>
          <button
            className="btn btn-outline-warning btn-lg px-4 rounded-pill"
            onClick={() => router.push('/adm/login')}
          >
            Acessar como Admin
          </button>
        </div>
      </div>
    </div>
  )
}
