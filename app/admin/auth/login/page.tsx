"use client";
import React, { useState } from "react";
import Layout from "../Layout";
import styles from "./login.module.css";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth, db } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { AdminAuthorizationLogin } from "../signup/handler";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs, where, query, collection } from "firebase/firestore";
const Login: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (adminEmail && adminPassword) {
      const formData = new FormData();
      formData.append("adminEmail", adminEmail);
      formData.append("adminPassword", adminPassword);

      try {
        const adminCheckResponse = await AdminAuthorizationLogin(formData);
        if(adminCheckResponse){
          signInWithEmailAndPassword(auth, adminEmail, adminPassword).then(
            (userDoc) => {
              if (adminCheckResponse) {
                let userName = ""
                const q = query(
                  collection(db, "admin/user-doc/users"),
                  where("email", "==", adminEmail)
                );
                 getDocs(q).then((querySnapShot) => {
                  querySnapShot.forEach((doc) => {
                    userName = doc.data().userName;
                  });
                  console.log(userName);
                  router.push(`/admin/home/${encodeURIComponent(userName)}`);
                });
              }
            }
          );
        }
        
      } catch (error: any) {
        if (error.code) {
          switch (error.code) {
            case "auth/invalid-email":
              setErrorMessage("Invalid email format.");
              break;
            case "auth/user-disabled":
              setErrorMessage("This account has been disabled.");
              break;
            case "auth/user-not-found":
              setErrorMessage("User not found.");
              break;
            case "auth/wrong-password":
              setErrorMessage("Incorrect password.");
              break;
            default:
              setErrorMessage("Error signing in: " + error.message);
          }
        } else {
          setErrorMessage(error.message || "An unknown error occurred.");
        }
      }
    } else {
      setErrorMessage("Email and password are required.");
    }
  };

  return (
    <Layout>
      <div className={styles.loginForm}>
        <h2>Login as Teacher</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className={styles.input}
          />
          <button className={styles.button} type="submit">
            Login
          </button>
          <a href="#" className={styles.forgotPassword}>
            Forgot password?
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
