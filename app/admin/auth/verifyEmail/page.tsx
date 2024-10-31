"use client";
import { useEffect } from "react";
import { sendEmailVerification } from "firebase/auth";
import Layout from "../Layout";
import { auth } from "@/firebase/clientApp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const router = useRouter();

  const handleEmailVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast.success("Verification email sent! Please check your inbox.");
        setTimeout(() => {
          router.push("./login");
        }, 10000);
      } catch (error: any) {
        toast.error("Error sending verification email: " + error.message);
      }
    } else {
      toast.warn("No user is currently logged in.");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Verify Email</h2>

      <button
        className="w-full p-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300"
        onClick={handleEmailVerification}
      >
        Send Verification Email
      </button>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Layout>
  );
}
