"use client";
import { auth, db } from "@/firebase/clientApp";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Auth() {
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
		await signInWithEmailAndPassword(auth, email, password)
			.then((response) => {
				console.log(response);
				setAuthMsg("Logged In");
				setIsLoggedIn(true);
			})
			.catch((error) => {
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
		await createUserWithEmailAndPassword(auth, email, password)
			.then(async (response) => {
				console.log(response);
				await updateProfile(response.user, { displayName: userName });
				await createStudentDoc(response.user.uid, userName, email);
				setAuthMsg("Account Created");
				setIsLoggedIn(true);
			})
			.catch((error) => {
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
					<h1 className="text-4xl text-blue-600 font-extrabold mb-5">Quizzr</h1>
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
					<button
						className="hover:border-slate-500 pr-4 pl-4 p-2 bg-blue-600 text-white m-2 rounded-lg text-lg font-semibold mt-4"
						onClick={isLogin ? handleLogin : handleSignUp}
					>
						{isLogin ? "Login" : "Sign Up"}
					</button>
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

async function createStudentDoc(userID: string, userName: string, email: string) {
	const docRef = doc(db, "users", userID);
	await setDoc(docRef, {
		userName: userName,
		email: email,
		joinedClassroom: null,
	});
}
