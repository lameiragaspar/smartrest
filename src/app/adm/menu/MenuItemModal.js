import { useState, useEffect } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import styles from './MenuItemModal.module.css'; // Criaremos este CSS

const MenuItemModal = ({ show, handleClose, item, categories, onSave }) => {
    const isEditing = !!item; // Verifica se estamos editando ou adicionando
    const initialFormData = {
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        available: true, 
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Atualiza o formulário quando o 'item' (para edição) muda
    useEffect(() => {
        if (isEditing && item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                price: item.price || '',
                category_id: item.category_id || '',
                image_url: item.image_url || '',
                available: item.available !== undefined ? item.available : true,
            });
        } else {
            setFormData(initialFormData); // Limpa para 'Adicionar'
        }
        setError(''); // Limpa erros ao abrir/mudar
    }, [item, isEditing, show]); // Depende de 'show' para limpar ao reabrir

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSave(formData, item?.id); // Chama a função de salvar passada como prop
            handleClose(); // Fecha o modal em caso de sucesso
        } catch (err) {
            setError(err.message || 'Falha ao salvar o item.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered size="lg">
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title>{isEditing ? 'Editar Item' : 'Adicionar Novo Item'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formItemName">
                        <Form.Label>Nome do Item</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={styles.formInput}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formItemDescription">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    </Form.Group>

                    <div className="row">
                        <Form.Group as={Col} md="6" className="mb-3" controlId="formItemPrice">
                            <Form.Label>Preço (Kz)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className={styles.formInput}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3" controlId="formItemCategory">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                                className={styles.formInput}
                            >
                                <option value="">Selecione...</option>
                                {categories.map(cat => (
                                    // Ignora "Todas" se existir
                                    cat.name !== 'Todas' && <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3" controlId="formItemImage">
                        <Form.Label>URL da Imagem</Form.Label>
                        <Form.Control
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    </Form.Group>

                     <Form.Group className="mb-4" controlId="formItemAvailable">
                        <Form.Check
                            type="switch"
                            id="available-switch"
                            label="Item Disponível"
                            name="available"
                            checked={formData.available}
                            onChange={handleChange}
                            className={styles.formSwitch}
                        />
                    </Form.Group>

                    <Modal.Footer className={styles.modalFooter}>
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, loading }) => (
  <Modal show={show} onHide={onCancel} centered backdrop="static">
    <Modal.Header closeButton className={styles.modalHeader}>
      <Modal.Title>{title || 'Confirmar ação'}</Modal.Title>
    </Modal.Header>
    <Modal.Body  className={styles.modalBody}>
      <p>{message || 'Tem certeza que deseja continuar?'}</p>
    </Modal.Body>
    <Modal.Footer className={styles.modalFooter}>
      <Button variant="secondary" onClick={onCancel} disabled={loading}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={onConfirm} disabled={loading}>
        {loading ? 'Removendo...' : 'Remover'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export  {ConfirmModal, MenuItemModal}