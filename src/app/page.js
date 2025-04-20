'use client';

import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Row>
          <Col>
            <Card className="p-4 shadow text-center card-fancy">
              <h3 className="mb-4">Quem está acessando?</h3>
              <Button variant="primary" className="mb-3 btn-fancy" onClick={() => router.push('/cliente')}>
                Sou Cliente
              </Button>
              <Button variant="secondary" className="btn-fancy" onClick={() => router.push('/admin')}>
                Sou Administrador
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}
