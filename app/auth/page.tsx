"use client";
import { auth, db } from "@/firebase/clientApp";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

export default function Auth() {
	const [isLoading, setIsLoading] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userName, setUserName] = useState("");
	const [authMsg, setAuthMsg] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (isLoggedIn) {
			router.push("/home");
		}
	}, [isLoggedIn]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!email || !password || (!isLogin && !userName)) {
			setAuthMsg("Please fill in all fields");
			return;
		}
		setIsLoading(true);
		try {
			if (isLogin) {
				await handleLogin();
			} else {
				await handleSignUp();
			}
		} catch (error) {
			console.error(error);
			setAuthMsg("An unexpected error occurred");
		}
	};

	const handleLogin = async () => {
		try {
			const response = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log(response);
			setAuthMsg("Logged In");
			setIsLoggedIn(true);
		} catch (error: any) {
			setIsLoading(false);
			switch (error.code) {
				case "auth/invalid-email":
					setAuthMsg("Invalid Email");
					break;
				case "auth/user-not-found":
					setAuthMsg("User Not Found");
					break;
				case "auth/wrong-password":
					setAuthMsg("Wrong Password");
					break;
				default:
					setAuthMsg("Something went wrong");
			}
		}
	};

	const handleSignUp = async () => {
		try {
			const response = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await updateProfile(response.user, { displayName: userName });
			await createStudentDoc(response.user.uid, userName, email);
			setAuthMsg("Account Created");
			setIsLoggedIn(true);
		} catch (error) {
			setIsLoading(false);
			switch (error.code) {
				case "auth/email-already-in-use":
					setAuthMsg("Email already in use");
					break;
				case "auth/invalid-email":
					setAuthMsg("Invalid Email");
					break;
				case "auth/weak-password":
					setAuthMsg("Weak Password");
					break;
				default:
					setAuthMsg("Something went wrong");
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full transform transition-all">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="px-8 pt-8">
						<div className="text-center mb-8">
							<h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
								Quizzr
							</h1>
							{authMsg && (
								<div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium animate-fade-in">
									{authMsg}
								</div>
							)}
						</div>
						<form onSubmit={handleSubmit} className="space-y-6">
							{!isLogin && (
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaUser className="h-5 w-5 text-gray-400" />
									</div>
									<input
										className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out text-sm"
										type="text"
										placeholder="Username"
										onChange={(e) =>
											setUserName(e.target.value)
										}
									/>
								</div>
							)}
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FaEnvelope className="h-5 w-5 text-gray-400" />
								</div>
								<input
									className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out text-sm"
									type="email"
									placeholder="Email"
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FaLock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out text-sm"
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
									onClick={() =>
										setShowPassword((prev) => !prev)
									}
								>
									{showPassword ? (
										<FaEyeSlash className="h-5 w-5" />
									) : (
										<FaEye className="h-5 w-5" />
									)}
								</button>
							</div>

							<div>
								<button
									type="submit"
									className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] "
									disabled={isLoading}
								>
									{isLoading ? (
										<div className="flex items-center space-x-2">
											<svg
												className="animate-spin h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
											<span>Processing...</span>
										</div>
									) : (
										<span>
											{isLogin
												? "Sign In"
												: "Create Account"}
										</span>
									)}
								</button>
							</div>
						</form>
					</div>

					<div className="px-8 py-6 bg-gray-50 mt-6">
						<button
							type="button"
							className="w-full text-lg text-gray-600 hover:text-gray-900 font-medium transition-colors duration-150"
							onClick={() => setIsLogin(!isLogin)}
						>
							{isLogin ? (
								<span>
									New to Quizzr?{" "}
									<span className="text-blue-600">
										Create an account
									</span>
								</span>
							) : (
								<span>
									Already have an account?{" "}
									<span className="text-blue-600">
										Sign in
									</span>
								</span>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

async function createStudentDoc(
	userID: string,
	userName: string,
	email: string
) {
	const docRef = doc(db, "users", userID);
	await setDoc(docRef, {
		userName: userName,
		email: email,
		joinedClassroom: null,
	});
}
