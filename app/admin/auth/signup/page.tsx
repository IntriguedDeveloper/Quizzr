"use client";
import React, { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter(); // For redirect

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message on each submit
    setIsLoading(true); // Start loading

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
        const collectionRef = collection(db, "users");
        await addDoc(collectionRef, {
          email: adminEmail,
          userName: adminUserName,
          isAdmin: true,
        });

        router.push("/admin/auth/login");
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
      } finally {
        setIsLoading(false); // End loading
      }
    } else {
      setErrorMessage("Email and password are required.");
      setIsLoading(false); // End loading
    }
  };

  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">Signup as Teacher</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="email"
            placeholder="Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-base"
            disabled={isLoading} // Disable input while loading
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-base"
            disabled={isLoading} // Disable input while loading
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-base"
            value={adminUserName}
            onChange={(e) => setAdminUserName(e.target.value)}
            disabled={isLoading} // Disable input while loading
          />
          <button
            className="w-full p-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"} {/* Loading text */}
          </button>
        </form>
        {isLoading && <p className="text-gray-500 mt-4">Please wait...</p>} {/* Loading indicator */}
      </div>
    </Layout>
  );
}
