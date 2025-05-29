'use client'; // Necessário para usar o usePathname (Hook do Cliente)

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook para pegar a rota atual
import styles from './Sidebar.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Garanta que os ícones estão importados

const Sidebar = () => {
  const pathname = usePathname(); // Pega a rota atual

  const navItems = [
    { href: '/adm/dashboard', icon: 'bi-grid-fill', label: 'Painel' },
    { href: '/adm/orders', icon: 'bi-receipt-cutoff', label: 'Pedidos' },
    { href: '/adm/menu', icon: 'bi-book-fill', label: 'Cardápio' },
    { href: '/adm/tables', icon: 'bi-grid-3x3-gap-fill', label: 'Mesas' },
    { href: '/adm/calls', icon: 'bi-bell-fill', label: 'Chamados' },
    { href: '/adm/cadastrochef', icon: 'bi-person-plus-fill', label: 'Cadastrar Chef' },
    // Adicione mais itens conforme necessário
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <i className="bi bi-egg-fried fs-2 me-2"></i> {/* Ícone de exemplo */}
        <span>Restaurante ADM</span>
      </div>
      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${
                  // Verifica se a rota atual começa com o href do link
                  // Isso faz com que /dashboard/orders/1 também ative /dashboard/orders
                  (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                    ? styles.activeLink
                    : ''
                }`}
              >
                <i className={`${item.icon} ${styles.navIcon}`}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
       <div className={styles.sidebarFooter}>
            <small>© 2025 - SmartRest</small>
        </div>
    </aside>
  );
};

export default Sidebar;