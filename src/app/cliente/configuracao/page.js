'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function ConfigurarMesa() {
  const [mesaDigitada, setMesaDigitada] = useState('');
  const router = useRouter();

  const salvarMesa = () => {
    if (!mesaDigitada.trim()) {
      alert('Digite um número de mesa válido.');
      return;
    }

    localStorage.setItem('mesa', mesaDigitada);
    router.push('/cliente/home');
  };

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
                <Button variant="success" className="btn-fancy w-100" onClick={salvarMesa}>
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
