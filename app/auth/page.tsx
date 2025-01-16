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
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Auth() {
	const [isLoading, setIsLoading] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userName, setUserName] = useState("");
	const [authMsg, setAuthMsg] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showPassword, setShowPassword] = useState(false); // State for password visibility
	const router = useRouter();

	useEffect(() => {
		if (isLoggedIn) {
			router.push("/home");
		}
	}, [isLoggedIn]);

	const handleLogin = async () => {
		setIsLoading(true);
		await signInWithEmailAndPassword(auth, email, password)
			.then((response) => {
				console.log(response);
				setAuthMsg("Logged In");
				setIsLoggedIn(true);
			})
			.catch((error) => {
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
			});
	};

	const handleSignUp = async () => {
		setIsLoading(true);
		await createUserWithEmailAndPassword(auth, email, password)
			.then(async (response) => {
				console.log(response);
				await updateProfile(response.user, { displayName: userName });
				await createStudentDoc(response.user.uid, userName, email);
				setAuthMsg("Account Created");
				setIsLoggedIn(true);
			})
			.catch((error) => {
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
			});
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center h-full w-full">
				<div className="flex flex-col justify-center items-center border-2 border-black p-4 rounded-lg">
					<h1 className="text-4xl text-blue-600 font-extrabold mb-5">
						Quizzr
					</h1>
					<a className="text-red-600">{authMsg}</a>
					{!isLogin ? (
						<input
							className="border-2 border-slate-400 p-2 m-2 rounded-md w-80"
							type="text"
							placeholder="Username"
							onChange={(e) => setUserName(e.target.value)}
						/>
					) : null}
					<input
						className="border-2 border-slate-400 p-2 m-2 rounded-md w-80"
						type="text"
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<div className="flex items-center border-2 border-slate-400 p-2 mt-2 rounded-md w-80">
						<input
							className="flex-1 outline-none"
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							type="button"
							className="flex items-center text-gray-500 hover:text-gray-700 text-xl"
							onClick={() => setShowPassword((prev) => !prev)}
						>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>
					{isLoading ? (
						<button
							disabled
							type="button"
							className="flex justify-center items-center w-full max-w-xs mt-4 p-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-700 focus:outline-none animate-pulse"
						>
							<svg
								aria-hidden="true"
								role="status"
								className="inline w-4 h-4 mr-2 text-gray-300 animate-spin"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="#1C64F2"
								/>
							</svg>
							Loading...
						</button>
					) : (
						<button
							className="flex justify-center items-center w-full max-w-xs mt-4 p-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 focus:outline-none font-semibold"
							onClick={isLogin ? handleLogin : handleSignUp}
						>
							{isLogin ? "Login" : "Sign Up"}
						</button>
					)}

					<a
						className="hover:border-slate-500 pr-4 pl-4 p-2 text-slate-400 rounded-lg text-lg font-semibold cursor-pointer"
						onClick={() => setIsLogin(!isLogin)}
					>
						{isLogin
							? "Don't have an account ? Sign Up"
							: "Already have an account ? Login"}
					</a>
				</div>
			</div>
		</>
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
