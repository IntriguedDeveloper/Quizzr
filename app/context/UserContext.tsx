"use client";

import { auth, db } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

import { createContext, useContext, useEffect, useState } from "react";

export type UserContextType = {
	userID: string | null;
	userEmail: string | null;
	userName: string | null;
	isAdmin: boolean | null;
	isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
	userID: null,
	userEmail: null,
	userName: null,
	isAdmin: null,
	isLoading: true,
});

export function UserContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<UserContextType>({
		userID: null,
		userEmail: null,
		userName: null,
		isAdmin: null,
		isLoading: true,
	});

	useEffect(() => {
		console.log("context effect ran");

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				let userID = user.uid;
				let email = user.email;
				let userName = "";
				let isAdmin: boolean = false;
				const q = await query(
					collection(db, "users"),
					where("email", "==", email)
				);
				const querySnapShot = await getDocs(q);

				await Promise.all(
					querySnapShot.docs.map(async (doc) => {
						userName = await doc.data().userName;
						isAdmin = await doc.data().isAdmin;
					})
				);

				setUser({
					userEmail: email,
					userName: user.displayName,
					userID: userID,
					isAdmin: isAdmin,
					isLoading: false,
				});
			} else {
				setUser({
					userID: null,
					userEmail: null,
					userName: null,
					isAdmin: false,
					isLoading: false,
				});
			}
		});

		return () => unsubscribe();
	}, []);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUserContext() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error(
			"useTeacherContext must be used within a TeacherContextProvider"
		);
	}
	return context;
}
