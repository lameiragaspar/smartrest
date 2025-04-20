import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/globals.css";
import Image from 'next/image';

export const metadata = {
  title: "SmartRest",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png"></link>
        <link rel="manifest" href="/site.webmanifest"></link>
      </head>
      <body>
        <div className="background-overlay">
          <header className="app-header ">
            <Image className='logo' src="/logo.png" alt='Logo' width={200} height={200}/>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
