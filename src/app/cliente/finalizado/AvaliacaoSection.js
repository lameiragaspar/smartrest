import { useState } from 'react';
import styles from './finalizado.module.css';

export default function AvaliacaoSection({ mesaId, onFinalizar }) {
    const [avaliacao, setAvaliacao] = useState(0);
    const [comentario, setComentario] = useState('');
    const [enviado, setEnviado] = useState(false);

    const enviarAvaliacao = async () => {
        if (!mesaId || avaliacao === 0) return;

        try {
            await fetch('/api/avaliacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mesa_id: mesaId, nota: avaliacao, comentario: comentario }),
            });

            localStorage.setItem(`avaliado-${mesaId}`, 'true');
            setEnviado(true);
            setTimeout(onFinalizar, 1500);
        } catch (err) {
            console.error('Erro ao enviar avaliação:', err);
        }
    };

    return (
        <div className="text-center text-white">
            <h4 className="mb-3">⭐ Avalie nossos pratos e serviços:</h4>

            <div className="d-flex justify-content-center mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                    <span
                        key={n}
                        onClick={() => setAvaliacao(n)}
                        style={{
                            fontSize: '2rem',
                            cursor: 'pointer',
                            color: n <= avaliacao ? '#ffc107' : '#555',
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>

            <div className="mb-3">
                <textarea
                    className={`form-control ${styles.noResize}`}
                    rows="3"
                    placeholder="Deixe um comentário opcional..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                ></textarea>

            </div>

            <button className="btn btn-success" onClick={enviarAvaliacao} disabled={enviado || avaliacao === 0}>
                Enviar avaliação
            </button>

            {enviado && <p className="text-success mt-3">Obrigado pela sua avaliação!</p>}
        </div>
    );
}