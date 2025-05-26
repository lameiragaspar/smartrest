'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function MensagensBoasVindas() {
  const ref = useRef(null);
  const estaNaTela = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <div ref={ref} className="text-center mb-4">
      {/* Título */}
      <motion.h2
        className="text-warning fw-bold mb-3"
        initial={{ opacity: 0, x: -80 }}
        animate={estaNaTela ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Cardápio
      </motion.h2>

      {/* Mensagem de boas-vindas */}
      <motion.p
        className="text-white-50 fs-5 mb-2"
        initial={{ opacity: 0, x: -80 }}
        animate={estaNaTela ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        Bem-vindo ao <strong>SmartRest</strong>! Explore nosso cardápio repleto de opções deliciosas.
      </motion.p>

      {/* Chamada para filtros */}
      <motion.p
        className="text-light small fst-italic"
        initial={{ opacity: 0, x: 80 }}
        animate={estaNaTela ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      >
        Use os filtros abaixo para encontrar exatamente o que deseja saborear.
      </motion.p>
    </div>
  );
}
