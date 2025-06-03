'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css'; // Importe os estilos da Sidebar
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Efeito para lidar com o redimensionamento da janela e estado inicial
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 850) {
        setIsOpen(true); // Sidebar aberta por padrão em desktop
        document.body.classList.remove('sidebar-open'); // Remove classe de overlay mobile
        document.body.classList.remove('sidebar-overlay-active'); // Remove overlay
        document.body.classList.remove('main-content-shifted'); // Garante que o main-content esteja na largura padrão se sidebar está aberta
      } else {
        setIsOpen(false); // Sidebar fechada por padrão em mobile
        // Em mobile, a classe 'main-content-shifted' é removida automaticamente pelo CSS do media query
      }
    };

    handleResize(); // Define o estado inicial com base no tamanho da tela

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Efeito para adicionar/remover classes do body com base no estado isOpen
  useEffect(() => {
    if (window.innerWidth <= 850) { // Lógica para telas menores (mobile)
      if (isOpen) {
        document.body.classList.add('sidebar-open'); // Para overflow: hidden no body
        document.body.classList.add('sidebar-overlay-active'); // Para ativar o overlay
      } else {
        document.body.classList.remove('sidebar-open');
        document.body.classList.remove('sidebar-overlay-active');
      }
    } else { // Lógica para telas maiores (desktop)
      if (isOpen) {
        // Se a sidebar estiver aberta em desktop, garante que o mainContentArea tem a margem
        document.body.classList.remove('main-content-shifted');
      } else {
        // Se a sidebar estiver fechada em desktop, o mainContentArea ocupa todo o espaço
        document.body.classList.add('main-content-shifted');
      }
    }
  }, [isOpen]); // Este efeito é executado sempre que 'isOpen' muda

  const navItems = [
    { href: '/adm/dashboard', icon: 'bi-grid-fill', label: 'Painel' },
    { href: '/adm/orders', icon: 'bi-receipt-cutoff', label: 'Pedidos' },
    { href: '/adm/menu', icon: 'bi-book-fill', label: 'Cardápio' },
    { href: '/adm/tables', icon: 'bi-grid-3x3-gap-fill', label: 'Mesas' },
    { href: '/adm/calls', icon: 'bi-bell-fill', label: 'Chamados' },
    { href: '/adm/cadastrochef', icon: 'bi-person-plus-fill', label: 'Add funcionário' },
  ];

  return (
    <>
      {/* Botão de toggle para mobile */}
      <button className={styles.sidebarToggle} onClick={toggleSidebar}>
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      {/* Overlay para escurecer o fundo em mobile quando a sidebar está aberta */}
      {isOpen && window.innerWidth <= 850 && <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.brand}>
          <i className="bi bi-egg-fried fs-2 me-2"></i>
          <span className={styles.brandText}>SmartRest | ADM</span>
        </div>
        <nav className={styles.nav}>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${
                    (pathname === item.href || (item.href !== '/adm/dashboard' && pathname.startsWith(item.href)))
                      ? styles.activeLink
                      : ''
                  }`}
                  onClick={() => window.innerWidth <= 850 && setIsOpen(false)} // Fecha a sidebar ao clicar em um link em telas pequenas
                >
                  <i className={`${item.icon} ${styles.navIcon}`}></i>
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <small className={styles.footerText}>© 2025 - SmartRest | Todos os direitos reservados</small>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;