'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import "../styles/globals.css";
import { motion } from 'framer-motion';

export default function ClienteInicio() {
  const [mesa, setMesa] = useState('');
  const [configurandoMesa, setConfigurandoMesa] = useState(false);
  const [mesaDigitada, setMesaDigitada] = useState('');

  useEffect(() => {
    const mesaSalva = localStorage.getItem('mesa');
    if (mesaSalva) {
      setMesa(mesaSalva);
    } else {
      setConfigurandoMesa(true);
    }
  }, []);

  const salvarNumeroDaMesa = () => {
    if (!mesaDigitada.trim()) {
      alert('Digite um número de mesa válido.');
      return;
    }

    localStorage.setItem('mesa', mesaDigitada);

    setMesa(mesaDigitada);
    setConfigurandoMesa(false);
  };

  // 🔸 Tela de configuração da mesa
  if (configurandoMesa) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={4}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="p-4 shadow card-fancy">
                  <h4 className="text-center mb-3">Configurar Número da Mesa</h4>
                  <Form.Group className="mb-3">
                    <Form.Label>Número da Mesa</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: 7"
                      value={mesaDigitada}
                      onChange={(e) => setMesaDigitada(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="success" className="btn-fancy" onClick={salvarNumeroDaMesa}>
                    Salvar
                  </Button>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.div>
    );
  }

  // 🔸 Tela principal após mesa salva
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Container className="py-5 justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
        <Row className="justify-content-center">
          <Col className="w-100 form-boas-vindas">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="shadow p-4 card-fancy ">
              <h2 className="text-center mb-4">
              Bem-vindo à{' '}
              <span className="text-mesa fw-bold display-6">Mesa {mesa}</span> 🍷
            </h2>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantas pessoas?</Form.Label>
                    <Form.Control type="number" min="1" max="10" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nomes</Form.Label>
                    <Form.Control as="textarea" rows={2} />
                  </Form.Group>

                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button variant="primary" className="w-100 btn-fancy">
                      Iniciar Conta
                    </Button>
                  </motion.div>
                </Form>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}
