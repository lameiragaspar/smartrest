'use client';

import { useEffect, useState } from 'react';
import styles from './Menu.module.css';
import sharedStyles from '../dashboard/Dashboard.module.css'; // Mantenha este import
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { ConfirmModal, MenuItemModal } from './MenuItemModal'; // Importa o modal

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [menuRes, catRes] = await Promise.all([
                fetch('/api/admin/cardapio'),
                fetch('/api/admin/categories')
            ]);

            const menuData = await menuRes.json();
            const catData = await catRes.json();

            setMenuItems(Array.isArray(menuData) ? menuData : []);
            setCategoriesList(Array.isArray(catData) ? catData : []);

        } catch (err) {
            console.error('Erro ao buscar dados:', err);
            setMenuItems([]);
            setCategoriesList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClick = () => {
        setEditingItem(null);
        setShowModal(true);
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const handleSave = async (formData, itemId) => {
        setActionLoading(true); // Inicia o loading da ação
        setError(''); // Limpa erros anteriores
        const method = itemId ? 'PUT' : 'POST';
        const url = itemId ? `/api/admin/cardapio?id=${itemId}` : '/api/admin/cardapio';

        const dataToSave = {
            ...formData,
            price: parseFloat(formData.price),
            category_id: parseInt(formData.category_id, 10),
        };

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Falha ao ${itemId ? 'atualizar' : 'adicionar'} item.`);
            }

            fetchData(); // Recarrega os dados após salvar
            handleCloseModal(); // Fecha o modal após salvar com sucesso
        } catch (err) {
            console.error('Erro ao salvar item:', err);
            setError(err.message || 'Erro ao salvar o item.');
        } finally {
            setActionLoading(false); // Finaliza o loading da ação
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setActionLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/cardapio?id=${selectedId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao remover o item.');
            }

            setMenuItems((prev) => prev.filter((item) => item.id !== selectedId));
            setShowConfirm(false);
            setSelectedId(null);
        } catch (err) {
            console.error('Erro ao excluir item:', err);
            setError(err.message || 'Erro ao remover o item.');
        } finally {
            setActionLoading(false);
        }
    };

    const displayCategories = [...new Set(menuItems.map(item => item.category))];

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className={`${sharedStyles.pageTitle} ${styles.pageTitle} mb-0`}> {/* Adicionei styles.pageTitle aqui */}
                    <i className="bi bi-book-fill me-2"></i>Cardápio Digital
                </h2>
                <button className={`btn btn-primary ${styles.addDishButton}`} onClick={handleAddClick}> {/* Adicionei styles.addDishButton aqui */}
                    <i className="bi bi-plus-circle-fill me-2"></i><span>Adicionar Item</span> {/* Adicionei span para ocultar o texto */}
                </button>
            </div>

            {loading ? (
                <p>Carregando cardápio...</p>
            ) : (
                displayCategories.map(category => (
                    <div key={category} className={`card mb-5 ${sharedStyles.cardDark}`}>
                        <div className="card-header">
                            <h4 className={styles.categoryTitle}>{category}</h4>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                {menuItems.filter(item => item.category === category).map(item => (
                                    <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className={`card h-100 ${styles.menuItemCard} ${!item.available ? styles.unavailable : ''}`}>
                                            <img src={item.image_url || 'https://via.placeholder.com/300x200/444/888?Text=Sem+Imagem'} className={`card-img-top ${styles.menuItemImage}`} alt={item.name} />
                                            <div className="card-body d-flex flex-column">
                                                <h5 className={`card-title ${styles.menuItemName}`}>{item.name}</h5>
                                                <p
                                                    className={`card-text ${styles.menuItemDescription}`}
                                                    title={item.description || 'Sem descrição.'}
                                                >
                                                    {item.description && item.description.length > 150
                                                        ? item.description.slice(0, 150) + '...'
                                                        : item.description || 'Sem descrição.'}
                                                </p>

                                                <div className="mt-auto pt-3">
                                                    <p className={`card-text ${styles.priceTag}`}>
                                                        Kz {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(item.price)}
                                                        {!item.available && (
                                                            <span className="badge bg-danger ms-2">Indisponível</span>
                                                        )}
                                                    </p>
                                                    <div className={styles.buttonGroup}>
                                                        <button
                                                            className="btn btn-sm btn-outline-warning me-2"
                                                            onClick={() => handleEditClick(item)}
                                                        >
                                                            <i className="bi bi-pencil-fill"></i><span> Editar</span> {/* Adicionei span */}
                                                        </button>
                                                        <Button variant="danger" size="sm" onClick={() => handleDeleteClick(item.id)}>
                                                            <i className="bi bi-trash-fill"></i><span> Remover</span> {/* Adicionei span e ícone */}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}

            <MenuItemModal
                show={showModal}
                handleClose={handleCloseModal}
                item={editingItem}
                categories={categoriesList}
                onSave={handleSave}
                loading={actionLoading} // Passe o estado de loading para o modal
                error={error} // Passe o estado de erro para o modal
            />
            <ConfirmModal
                show={showConfirm}
                title="Remover Item"
                message="Tem certeza que deseja remover este item do cardápio?"
                onCancel={() => {
                    setShowConfirm(false);
                    setSelectedId(null);
                }}
                onConfirm={confirmDelete}
                loading={actionLoading}
                error={error}
            />

        </div>
    );
};

export default MenuPage;