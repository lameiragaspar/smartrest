import { useEffect, useState, useRef } from 'react';
import styles from './SummaryCard.module.css';

const SummaryCard = ({ title, value, icon, link, bgColor = '#333', accentColor = '#ffc107' }) => {
  const [animate, setAnimate] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setAnimate(true);
      prevValueRef.current = value;
      const timeout = setTimeout(() => setAnimate(false), 600); // duração da animação
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <div className={`card ${styles.summaryCard}`} style={{ backgroundColor: bgColor }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className={`card-title ${styles.cardTitle}`}>{title}</h5>
            <p className={`card-text ${styles.cardValue} ${animate ? styles.pulseValue : ''}`}>
              {value}
            </p>
          </div>
          <div className={styles.cardIcon} style={{ color: accentColor }}>
            {icon || <i className="bi bi-bar-chart-fill fs-1"></i>}
          </div>
        </div>
        {link && (
          <a
            href={link}
            className={`btn btn-sm ${styles.cardLink}`}
            style={{ backgroundColor: accentColor, color: '#1f1f1f' }}
          >
            Ver Detalhes
          </a>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
