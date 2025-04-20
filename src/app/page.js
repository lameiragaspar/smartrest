import styles from "./page.module.css";
import IndexCliente from "@/cliente/indexClient.js";

export default function Home() {
  return (
    <div className={styles.page}>
      <IndexCliente/>
    </div>
  );
}
