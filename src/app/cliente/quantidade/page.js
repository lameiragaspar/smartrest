'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

export default function QuantidadePessoasPage() {
  const [quantidade, setQuantidade] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    const mesa = localStorage.getItem('mesa');

    if (!mesa) {
      alert('Mesa não configurada!');
      return;
    }

    if (!quantidade || parseInt(quantidade) <= 0) {
      alert('Digite uma quantidade válida');
      return;
    }

    // Envia para API
    const res = await fetch('../../api/mesa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mesa, quantidade }),
    });

    if (res.ok) {
      router.push('/cliente/nomes'); // próxima etapa
    } else {
      alert('Erro ao registrar número de pessoas');
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4 shadow">
            <h4 className="text-center mb-3">Quantas pessoas estão na mesa?</h4>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                min="1"
                max="20"
                placeholder="Ex: 4"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" className="w-100" onClick={handleSubmit}>
              Continuar
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
