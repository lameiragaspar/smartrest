'use client';

import { useEffect, useRef, useState } from 'react';
import { HiOutlinePhone, HiOutlineX } from 'react-icons/hi';
import { TbHeadset } from 'react-icons/tb';
import ChatFeedback from './ChatFeedbak';
import styles from './statusSection.module.css';

export default function ChatWrapper({ mesa }) {
    const [aberto, setAberto] = useState(false);
    const wrapperRef = useRef(null);

    // Fecha o chat ao clicar fora
    useEffect(() => {
        function handleClickFora(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setAberto(false);
            }
        }
        if (aberto) {
            document.addEventListener('mousedown', handleClickFora);
        } else {
            document.removeEventListener('mousedown', handleClickFora);
        }
        return () => document.removeEventListener('mousedown', handleClickFora);
    }, [aberto]);

    return (
        <div ref={wrapperRef}>
            {aberto && <ChatFeedback mesa={mesa} />}

            <button
                className={styles.chatToggleBtn}
                onClick={() => setAberto(prev => !prev)}
                aria-label="Abrir ou Fechar Chat de Feedback"
            >
                {aberto
                    ? <HiOutlineX size={24} color="#000" />
                    : <TbHeadset size={24} color="#000" />
                }

            </button>
        </div>
    );
}
