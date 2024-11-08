"use client";
import React, { useState } from "react";
import Layout from "../Layout";
import { AdminAuthorizationLogin, AdminAuthorizationSignUp } from "../handler";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";

export default function SignUp() {
	const [adminEmail, setAdminEmail] = useState("");
	const [adminPassword, setAdminPassword] = useState("");
	const [adminUserName, setAdminUserName] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		setIsLoading(true);

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

				const collectionRef = collection(db, "users");
				await addDoc(collectionRef, {
					email: adminEmail,
					userName: adminUserName,
					isAdmin: true,
				});

				router.push("/admin/auth/verifyEmail");
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
			setIsLoading(false);
		}
	};

	return (
		<Layout>
			<h2 className="text-2xl font-bold mb-6">Signup as Teacher</h2>
			{errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
			<form onSubmit={handleSubmit} className="w-full">
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
				<input
					type="text"
					placeholder="Username"
					className="w-full p-3 mb-4 border border-gray-300 rounded-md text-base"
					value={adminUserName}
					onChange={(e) => setAdminUserName(e.target.value)}
					disabled={isLoading}
				/>
				<button
					className="w-full p-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300"
					type="submit"
					disabled={isLoading}
				>
					{isLoading ? "Signing up..." : "Sign Up"} {/* Loading text */}
				</button>
			</form>
			{isLoading && <p className="text-gray-500 mt-4">Please wait...</p>}{" "}
			{/* Loading indicator */}
		</Layout>
	);
}
