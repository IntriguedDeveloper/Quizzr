"use client";
import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { AdminAuthorizationLogin } from "../handler";
import { getDocs, where, query, collection } from "firebase/firestore";

const Login: React.FC = () => {
	const [adminEmail, setAdminEmail] = useState("");
	const [adminPassword, setAdminPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// Prefetch the dashboard page
		router.prefetch("/admin/home");
	}, [router]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		setIsLoading(true);

		if (adminEmail && adminPassword) {
			const formData = new FormData();
			formData.append("adminEmail", adminEmail);
			formData.append("adminPassword", adminPassword);

			try {
				const adminCheckResponse = await AdminAuthorizationLogin(formData);

				if (adminCheckResponse) {
					const userCredential = await signInWithEmailAndPassword(
						auth,
						adminEmail,
						adminPassword
					);
					let userName = "";

					const q = query(
						collection(db, "users"),
						where("email", "==", adminEmail)
					);
					const querySnapShot = await getDocs(q);

					querySnapShot.forEach((doc) => {
						console.log(doc.data().userName);
						userName = doc.data().userName;
					});

					await router.push(`/admin/home`);
					setIsLoading(false);
				}
			} catch (error: any) {
				console.log(error.code);

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
			}
			setIsLoading(false);
		} else {
			setErrorMessage("Email and password are required.");
			setIsLoading(false);
		}
	};

	return (
		<Layout>
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
		</Layout>
	);
};

export default Login;
