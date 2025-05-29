import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/globals.css";
import Animate from '@/components/Motion';
import Header from '@/components/Header';

export const metadata = {
  title: "SmartRest",
  description: "Sistema moderno para restaurantes",
  icons: {
    icon: "/img/favicon-32x32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <div className="app-container">
          <div className="overlay"></div>
          <Header />
          <main>
            <Animate>
              {children}
            </Animate>
          </main>
        </div>
      </body>
    </html>
  );
}