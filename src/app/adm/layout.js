import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import styles from './DashboardLayout.module.css';

export const metadata = {
  title: "SmartRest | Dashboard",
  description: "Sistema moderno para restaurantes",
  icons: {
    icon: "/img/favicon-32x32.png",
  },
};

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar está fixa, não precisa estar aqui */}
      <Sidebar />

      {/* Área principal que contém Navbar e Conteúdo */}
      <div className={styles.mainContentArea}>
        <Navbar />
        <main className={styles.main}>
          {/* Wrapper para aplicar o max-width e centralizar */}
          <div className={styles.contentWrapper}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}