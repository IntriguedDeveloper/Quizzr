"use client";
import React, { useEffect } from "react";
import { auth } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
const AdminAuthPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin/home");
      } else {
        router.push("/admin/signup");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default AdminAuthPage;
