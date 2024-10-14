"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation"; // Adjust import
import styles from "./page.module.css";
import { getDocs, where, query, collection } from "firebase/firestore";

const AdminAuthPage: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(
          collection(db, "admin/user-doc/users"),
          where("email", "==", user.email)
        );
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach((doc) => {
          setUserName(doc.data().userName);
        });
        console.log(userName);
        router.push(`/admin/home/${encodeURIComponent(userName)}`);
      } else {
        router.push("/admin/signup");
      }
    });

    return () => unsubscribe();
  }, [router, userName]);

  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default AdminAuthPage;
