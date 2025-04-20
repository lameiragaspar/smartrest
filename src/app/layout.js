import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/globals.css";
import Header from '@/components/Header';

export const metadata = {
  title: "SmartRest",
  description: "Sistema moderno para restaurantes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/favicon-32x32.png" />
      </head>
      <body>
        <div className="background-overlay">
          <Header/>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
