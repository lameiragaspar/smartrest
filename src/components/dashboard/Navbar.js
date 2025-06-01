import styles from './Navbar.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Garanta que os ícones estão importados

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.pageTitle}>
        {/* Idealmente, o título viria do estado ou contexto da rota */}
        Painel de Controle
      </div>
      <div className={styles.userInfo}>
        <i className={`bi bi-person-circle ${styles.userIcon}`}></i>
        <span>Administrador</span>
        <button className={`btn btn-sm ${styles.logoutButton}`}>
          <i className="bi bi-box-arrow-right"></i> Sair
        </button>
      </div>
    </header>
  );
};

export default Navbar;