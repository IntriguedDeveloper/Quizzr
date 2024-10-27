"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useUserContext } from "../context/UserContext";

const Home: React.FC = () => {
  const router = useRouter();
  const userData = useUserContext();
  useEffect(() => {
    async function getUserData() {
      const { userName, isAdmin, isLoading } = await userData;
      console.log("User Data:", userData);
      if (!isLoading) {
        if (userName) {
          console.log("This is user data: " + userData.userEmail);
          if (isAdmin) {
            router.push(`/admin/home`);
          } else {
            router.push("/admin/auth/signup");
          }
        } else {
          router.push("/auth/login");
        }
      }
    }
    getUserData();
  }, [router, userData]);

  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Home;
