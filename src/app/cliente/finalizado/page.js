'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function FinalizadoPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/');
    }, 6000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="container d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: '80vh' }}
    >
      <img
        src="/img/illustrations/order-complete.svg"
        alt="Pedido finalizado"
        style={{ maxWidth: '280px', marginBottom: '20px' }}
      />

      <h2 className="text-success mb-3 fw-bold">✅ Pedido enviado com sucesso!</h2>

      <p className="text-white mb-4 fs-5">
        A cozinha já está preparando seus pratos.<br />Você será redirecionado em instantes...
      </p>

      <button className="btn btn-outline-light px-4 py-2" onClick={() => router.push('/')}>
        Voltar ao início
      </button>
    </motion.div>
  );
}

