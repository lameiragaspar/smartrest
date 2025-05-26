'use client';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaUserFriends } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from '../cardapio/cardapio.module.css';
import style from '../cliente.module.css';

export default function CardItem({ produto, index, mesa, abrirModal }) {
    return (
        <motion.div
            className="col-md-6 col-lg-4 mb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
        >
            <div className={`card h-100 bg-dark text-white shadow-lg border-0 rounded-4 overflow-hidden ${styles.card}`}>
                {produto.image_url && (
                    <img
                        loading="lazy"
                        src={produto.image_url.startsWith('http') ? produto.image_url : `/img/${produto.image_url}`}
                        alt={produto.name}
                        className="card-img-top"
                        style={{ height: 200, objectFit: 'cover', borderBottom: '4px solid #ffc107' }}
                    />
                )}
                <div className="card-body d-flex flex-column">
                    <h5 className={`card-title fw-bold ${styles.cardTitle}`}>
                        {produto.name} <span className={style.numMesa}>#{mesa}</span>
                    </h5>
                    <p className="card-text text-secondary flex-grow-1">{produto.description}</p>
                    <div className="mt-3">
                        <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill">
                            Kz {Number(produto.price).toFixed(2)}
                        </span>
                    </div>
                    <div className="position-absolute bottom-0 end-0 m-3">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Adicionar ao pedido</Tooltip>}>
                            <button
                                className={`btn btn-warning btn-sm shadow rounded-circle ${styles.carrinhoBtn}`}
                                onClick={() => abrirModal(produto)}
                            >
                                <FaUserFriends size={20} />
                            </button>
                        </OverlayTrigger>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
