"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useUserContext } from "./context/UserContext";

const Home: React.FC = () => {
  const router = useRouter();
  const userData = useUserContext();

  useEffect(() => {
    const getUserData = async () => {
      if (!userData.isLoading) {
        console.log("User Data:", userData);
        
        if (userData.userEmail) {
          console.log("This is user data: " + userData.userEmail);

          if (userData.isAdmin) {
            router.push(`/admin/home`);
          } else {
            router.push("/home");
          }
        } else {
          router.push("/auth");
        }
      }
    };

    getUserData();
  }, [userData, router]);

  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Home;
