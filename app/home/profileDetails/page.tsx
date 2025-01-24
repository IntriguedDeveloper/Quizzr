"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useUserContext } from "@/app/context/UserContext";
import { auth, db } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";
export default function ProfileDetails() {
	const router = useRouter();
	const userData = useUserContext();
	const [profileDetails, setProfileDetails] = useState({
		name: userData.userName || "",
		email: userData.userEmail || "",
	});
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	useEffect(() => {
		if (userData.userName && userData.userEmail) {
			setProfileDetails({
				name: userData.userName,
				email: userData.userEmail,
			});
		}
	}, [userData]);
	const handleProfileEdit = async () => {
		const auth = getAuth();
		const user = auth.currentUser;

		if (user && isEditingProfile) {
			await updateProfile(user, { displayName: profileDetails.name });
		}

		setIsEditingProfile(!isEditingProfile);
	};

	const handleProfileChange = (e: any) => {
		const { name, value } = e.target;
		setProfileDetails({ ...profileDetails, [name]: value });
	};

	const deleteUser = async () => {
		await deleteDoc(doc(db, `students/${userData.userID}`));	
		await signOut(auth);
		router.push("/auth");
	};
	return (
		<div className="lg:w-[60%] w-full p-4 border rounded-lg shadow-md bg-white mt-2">
			<h2 className="text-lg font-semibold mb-4">Profile Details</h2>
			<div className="space-y-2">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Name:
					</label>
					{isEditingProfile ? (
						<input
							type="text"
							name="name"
							value={profileDetails.name}
							onChange={handleProfileChange}
							className="w-full border rounded p-2"
						/>
					) : (
						<p>{profileDetails.name}</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Email:
					</label>
					<p>{profileDetails.email}</p>
				</div>
			</div>
			<div className="flex justify-between mt-4">
				<button
					onClick={handleProfileEdit}
					className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-bold"
				>
					{isEditingProfile ? "Save" : "Edit"}
				</button>
				<button
					className="px-4 py-2 text-white bg-red-600 rounded font-bold"
					onClick={deleteUser}
				>
					Logout
				</button>
			</div>
		</div>
	);
}
