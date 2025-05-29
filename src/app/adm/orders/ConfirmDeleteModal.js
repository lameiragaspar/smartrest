// components/admin/ConfirmDeleteModal.js
import { Modal, Button, Spinner } from 'react-bootstrap';

const ConfirmDeleteModal = ({ show, handleClose, handleConfirm, itemName, loading }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton style={{ backgroundColor: '#1f1f1f', color: '#dc3545', borderBottom: '1px solid #444' }}>
                <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#333', color: '#fff' }}>
                <p>Tem certeza que deseja excluir o Pedido <strong>#{itemName}</strong>?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#1f1f1f', borderTop: '1px solid #444' }}>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleConfirm} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Excluindo...
                        </>
                    ) : (
                        'Confirmar Exclusão'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDeleteModal;