'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';

export default function NomesPage() {
  const [quantidade, setQuantidade] = useState(0);
  const [nomes, setNomes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const mesa = localStorage.getItem('mesa');
    if (!mesa) {
      alert('Mesa não configurada!');
      router.push('/cliente'); // Redireciona de volta
      return;
    }

    async function buscarQuantidade() {
      try {
        const res = await fetch(`/api/quantnomes?mesa=${mesa}`);
        const data = await res.json();
        if (res.ok && data.quantidade_pessoas) {
          setQuantidade(data.quantidade_pessoas);
          setNomes(Array.from({ length: data.quantidade_pessoas }, () => ''));
        } else {
          alert('Erro ao buscar quantidade da mesa');
        }
      } catch (error) {
        console.error(error);
        alert('Erro na comunicação com o servidor.');
      } finally {
        setCarregando(false);
      }
    }

    buscarQuantidade();
  }, [router]);

  const handleNomeChange = (index, valor) => {
    const novosNomes = [...nomes];
    novosNomes[index] = valor;
    setNomes(novosNomes);
  };

  const salvarNomes = async () => {
    const mesa = localStorage.getItem('mesa');
    if (!mesa) return;

    const nomesValidos = nomes.filter((nome) => nome.trim().length > 0);
    if (nomesValidos.length < quantidade) {
      alert('Preencha todos os nomes.');
      return;
    }

    const res = await fetch('/api/nomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mesa, nomes: nomesValidos }),
    });

    if (res.ok) {
      router.push('/cliente/cardapio');
    } else {
      alert('Erro ao salvar nomes');
    }
  };

  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="p-4 shadow">
            <h4 className="text-center mb-4">Informe os nomes das {quantidade} pessoas</h4>
            {nomes.map((nome, index) => (
              <Form.Group className="mb-3" key={index}>
                <Form.Label>Pessoa {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Nome da pessoa ${index + 1}`}
                  value={nome}
                  onChange={(e) => handleNomeChange(index, e.target.value)}
                />
              </Form.Group>
            ))}
            <Button variant="primary" className="w-100" onClick={salvarNomes}>
              Confirmar Nomes
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}