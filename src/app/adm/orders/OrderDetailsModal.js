'use client';// components/admin/OrderDetailsModal.js
import { useState, useEffect } from 'react';
import { Modal, Button, Table, Spinner } from 'react-bootstrap';
import styles from './OrderDetailsModal.module.css'; // Certifique-se que este arquivo CSS existe

const OrderDetailsModal = ({ show, handleClose, orderId }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show && orderId) {
            const fetchOrderDetails = async () => {
                setLoading(true);
                setError('');
                try {
                    const res = await fetch(`/api/admin/orders_items?orderId=${orderId}`);
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({ message: 'Falha ao analisar resposta de erro' }));
                        throw new Error(errorData.message || `Falha ao buscar detalhes do pedido. Status: ${res.status}`);
                    }
                    const data = await res.json();
                    setItems(Array.isArray(data) ? data : []);
                    console.log(items)
                } catch (err) {
                    setError(err.message);
                    setItems([]);
                } finally {
                    setLoading(false);
                    console.log(items)
                }
            };
            fetchOrderDetails();
        } else if (!show) { // Limpa o estado quando o modal é fechado
            setItems([]);
            setError('');
        }
    }, [show, orderId]);
    console.log(items)
    const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
        }).format(value || 0); // Garante que o valor não seja nulo/undefined

    // Calcula o total com base nos itens buscados
    const totalOrder = items.reduce((acc, item) => acc + (item.quantity * (item.product_price || 0)), 0);

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title>Detalhes do Pedido #{orderId} — Mesa {items[0]?.table_number || ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                {loading && (
                    <div className="text-center p-3">
                        <Spinner animation="border" variant="warning" />
                        <p className="mt-2">Carregando itens...</p>
                    </div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && (
                    <Table striped bordered hover variant="dark" responsive>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Cliente</th>
                                <th>Qtd.</th>
                                <th>Preço Unit.</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>{items.length > 0 ? (items.map(item => (
                            <tr key={item.id}>
                                <td>{item.product_name}</td>
                                <td>{item.client_name || 'N/A'}</td>
                                <td>{item.quantity}</td>
                                <td>{formatCurrency(item.product_price)}</td>
                                <td>{formatCurrency(item.quantity * item.product_price)}</td>
                            </tr>)) ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Nenhum item encontrado para este pedido.
                                </td>
                            </tr>)}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colSpan="4" className="text-end fw-bold">Total do Pedido:</td>
                                <td className="fw-bold">{formatCurrency(totalOrder)}</td>
                            </tr>
                        </tfoot>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsModal;