import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/globals.css";

export const metadata = {
  title: "SmartRest",
  description: "Sistema moderno para restaurantes",
  icons: {
    icon: "/img/favicon-32x32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}