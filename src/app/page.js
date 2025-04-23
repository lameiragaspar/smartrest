'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="d-flex justify-content-center align-items-center text-white text-center">
      <div className="bg-dark bg-opacity-75 rounded-4 p-5 shadow-lg">
        <h1 className="display-4 mb-4 fw-bold">Bem-vindo ao Restaurante</h1>
        <p className="lead mb-5">Escolha seu tipo de acesso para continuar</p>
        <div className="d-flex gap-3 justify-content-center">
          <button
            className="btn btn-outline-light btn-lg px-4 rounded-pill"
            onClick={() => router.push('/cliente')}
          >
            Acessar como Cliente
          </button>
          <button
            className="btn btn-outline-warning btn-lg px-4 rounded-pill"
            onClick={() => router.push('/admin')}
          >
            Acessar como Admin
          </button>
        </div>
      </div>
    </div>
  )
}
