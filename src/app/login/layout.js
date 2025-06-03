import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/globals.css";

export const metadata = {
  title: "SmartRest | Login",
};

export default function LoginLayout({ children }) {
  return (
      <section>
        {children}
      </section>
  );
}
