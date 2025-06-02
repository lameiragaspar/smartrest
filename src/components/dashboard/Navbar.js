'use client';

import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include', // ESSENCIAL para enviar o cookie
      });
      router.push('/login');
    } catch (err) {
      console.error('Erro ao sair:', err);
    } finally {
      router.push('/login');
    }
  };



  return (
    <header className={styles.navbar}>
      <div className={styles.pageTitle}>Painel de Controle</div>
      <div className={styles.userInfo}>
        <i className={`bi bi-person-circle ${styles.userIcon}`}></i>
        <span>Administrador</span>
        <button
          className={`btn btn-sm ${styles.logoutButton}`}
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i> Sair
        </button>
      </div>
    </header>
  );
};

export default Navbar;
