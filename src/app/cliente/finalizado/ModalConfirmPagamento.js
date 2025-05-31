'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import styles from './Modalpagamento.module.css';

const CODIGO_PAGAMENTO_GENERICO_ESPERADO = 'PGTOOK';

export default function ModalPagamento({
  show,
  onHide,
  onConfirmPayment,
  garcons,
  confirming,
  metodoPagamento,
  totalMesa,
  mesaId,
}) {
  const [selectedGarconId, setSelectedGarconId] = useState('');
  const [garconSenha, setGarconSenha] = useState('');
  const [codigoPagamentoGenerico, setCodigoPagamentoGenerico] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [waiterNotified, setWaiterNotified] = useState(false);

  useEffect(() => {
    if (show) {
      setModalErrorMessage('');
      setSelectedGarconId(garcons[0]?.id || '');
      setGarconSenha('');
      setCodigoPagamentoGenerico('');
      setTransactionId('');
      setWaiterNotified(false);
    }
  }, [show, garcons]);

  if (!show) return null;

  const handleConfirm = () => {
    setModalErrorMessage('');

    const garcon = garcons.find(g => g.id === selectedGarconId);
    if (!garcon) return setModalErrorMessage('Por favor, selecione um garçom.');

    if (codigoPagamentoGenerico !== CODIGO_PAGAMENTO_GENERICO_ESPERADO) return setModalErrorMessage('Código genérico inválido.');
    if ((['transfer', 'cartao', 'mcexpress'].includes(metodoPagamento)) && !transactionId) {
      return setModalErrorMessage('ID da Transação é obrigatório.');
    }

    onConfirmPayment({
      selectedGarconId,
      garconSenha,
      codigoPagamentoGenerico,
      transactionId,
      garconNome: garcon.nome,
    });
  };

  const mockPhone = '937222444';
  const urlQrCode = `https://app.appypay.co.ao/qrcode?phone=${mockPhone}&amount=${totalMesa}&reference=Mesa:${mesaId}`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Confirmação do Garçom</h2>
          <button onClick={onHide} className={styles.closeBtn} disabled={confirming}>×</button>
        </header>

        <div className={styles.body}>
          {modalErrorMessage && <div className={styles.error}>{modalErrorMessage}</div>}

          {!waiterNotified ? (
            <div className={styles.centered}>
              <p className="lead">O garçom foi notificado para confirmar o pagamento.</p>
              <p>Aguarde a chegada do garçom para autenticação.</p>
              <button className={styles.btnSucesso} onClick={() => setWaiterNotified(true)} disabled={confirming}>
                Avançar
              </button>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); handleConfirm(); }}>
              {metodoPagamento === 'mcexpress' && (
                <div className={styles.qrSection}>
                  <p>Escaneie o QR Code com o Multicaixa Express:</p>
                  <QRCode value={urlQrCode} size={180} level="H" />
                  <p className="mt-2">Valor: {totalMesa.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
                </div>
              )}

              <label>Garçom:</label>
              <select value={selectedGarconId} onChange={e => setSelectedGarconId(e.target.value)} disabled={confirming}>
                <option value="" disabled>Selecione o garçom</option>
                {garcons.map(garcon => (
                  <option key={garcon.id} value={garcon.id}>{garcon.name}</option>
                ))}
              </select>

              <label>Senha do Garçom:</label>
              <input
                type="password"
                value={garconSenha}
                onChange={e => setGarconSenha(e.target.value)}
                disabled={confirming}
              />

              <label>Código Genérico:</label>
              <input
                type="text"
                value={codigoPagamentoGenerico}
                onChange={e => setCodigoPagamentoGenerico(e.target.value)}
                disabled={confirming}
              />

              {['transfer', 'cartao', 'mcexpress'].includes(metodoPagamento) && (
                <>
                  <label>ID da Transação:</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    disabled={confirming}
                  />
                </>
              )}

              <div className={styles.footer}>
                <button type="button" onClick={onHide} className={styles.btnCinza} disabled={confirming}>Cancelar</button>
                <button type="submit" className={styles.btnSucesso} disabled={confirming}>
                  {confirming ? 'Confirmando...' : 'Confirmar Pagamento'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
