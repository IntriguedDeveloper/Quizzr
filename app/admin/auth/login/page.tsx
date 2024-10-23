"use client";
import React, { useState } from "react";
import Layout from "../Layout";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { AdminAuthorizationLogin } from "../signup/handler";
import { getDocs, where, query, collection } from "firebase/firestore";

const Login: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true); // Start loading

    if (adminEmail && adminPassword) {
      const formData = new FormData();
      formData.append("adminEmail", adminEmail);
      formData.append("adminPassword", adminPassword);

      try {
        // Admin authorization check
        const adminCheckResponse = await AdminAuthorizationLogin(formData);

        if (adminCheckResponse) {
          // Firebase authentication check
          const userCredential = await signInWithEmailAndPassword(
            auth,
            adminEmail,
            adminPassword
          );
          let userName = "";
          // Query Firestore for admin user details
          const q = query(
            collection(db, "users"),
            where("email", "==", adminEmail)
          );
          const querySnapShot = await getDocs(q);

          querySnapShot.forEach((doc) => {
            console.log(doc.data().userName)
            userName = doc.data().userName;
          });

          
          router.push(`/admin/home/${encodeURIComponent(userName)}`);
        }
      } catch (error: any) {
        console.log(error.code);

        // Handle Firebase-specific errors using if statements
        if (error.code) {
          console.log("if fired");
          console.log(error.code == "auth/invalid-credential");
          if (error.code === "auth/invalid-email") {
            console.log("Invalid email format case fired");
            setErrorMessage("Invalid email format.");
          } else if (error.code === "auth/user-disabled") {
            setErrorMessage("This account has been disabled.");
          } else if (error.code === "auth/user-not-found") {
            setErrorMessage("User not found.");
          } else if (error.code === "auth/wrong-password") {
            setErrorMessage("Incorrect password.");
          } else if (error.code == "auth/invalid-credential") {
            setErrorMessage("Email or Password incorrect.");
          } else {
            setErrorMessage("Error signing in: " + error.message);
          }
        } else {
          setErrorMessage(
            error.message || "An unknown error occurred during authorization."
          );
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Email and password are required.");
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Login as Teacher</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleLogin} className="w-full">
          <input
            type="email"
            placeholder="Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-base"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-base"
            disabled={isLoading}
          />
          <button
            className="w-full p-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <a href="#" className="mt-4 text-blue-600 hover:underline">
            Forgot password?
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
