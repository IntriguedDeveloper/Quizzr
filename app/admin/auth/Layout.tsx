// components/Layout.tsx
import React from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Quizzr</h1>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default Layout;
