"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { getDocs, where, query, collection } from "firebase/firestore";

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string>();
  const [isAdmin, setAdmin] = useState<boolean>();
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userName = "";
        let isAdmin = "";
        const q = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );
        const querySnapShot = await getDocs(q);
        console.log(querySnapShot);
        querySnapShot.forEach(async (doc) => {
          userName = doc.data().userName;
          isAdmin = doc.data().isAdmin;
        });
        console.log(userName);
        if (userName) {
          if (isAdmin) {
            router.push(`/admin/home/${encodeURIComponent(userName)}`);
          } else {
            router.push("/admin/auth/signup");
          }
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Home;
