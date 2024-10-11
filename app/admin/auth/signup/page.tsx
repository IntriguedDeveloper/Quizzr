"use client";
import React, { useEffect, useState } from "react";
import styles from "./signup.module.css";
import Layout from "../Layout";
import { AdminAuthorizationLogin, AdminAuthorizationSignUp } from "./handler";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/clientApp";
import { useRouter } from "next/navigation"; // For redirection
import { addDoc, collection } from "firebase/firestore";

export default function SignUp() {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUserName, setAdminUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // For displaying error messages
  const router = useRouter(); // For redirect

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message on each submit

    const formData = new FormData();
    formData.append("adminEmail", adminEmail);
    formData.append("adminPassword", adminPassword);

    if (adminEmail && adminPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          adminEmail,
          adminPassword
        );
        const user = userCredential.user;

        const signupResponse = await AdminAuthorizationSignUp(formData);
        if (!signupResponse.setAdminState) {
          throw new Error("Failed to set admin custom claim.");
        }


        alert("Signup successful! Redirecting to admin login...");
        
        // Save admin details to Firestore
        const collectionRef = collection(db, "admin/user-doc/users");
        await addDoc(collectionRef, {
          email: adminEmail,
          userName: adminUserName,
        });
        
        router.push("/admin/login");
      } catch (error: any) {
        // Handle and display the error message for both sign-in and authorization failures
        if (error.code) {
          // Firebase-specific error (email/password issues)
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
          // Handle custom claim or login errors
          setErrorMessage(error.message || "An unknown error occurred.");
        }
      }
    } else {
      setErrorMessage("Email and password are required.");
    }
  };

  return (
    <Layout>
      <div className={styles.signUpForm}>
        <h2>Signup as Teacher</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}{" "}
        {/* Display error message */}
        <form onSubmit={handleSubmit}>
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
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={adminUserName}
            onChange={(e) => setAdminUserName(e.target.value)}
          />
          <button className={styles.button} type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </Layout>
  );
}
