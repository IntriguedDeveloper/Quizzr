"use client";

import { app, auth, db } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import SubjectCard from "./_components/SubjectCard";
import useSWR from "swr";
import {
	getAuth,
	getIdToken,
	onAuthStateChanged,
	signOut,
	updateProfile,
} from "firebase/auth";
import { FaExternalLinkAlt } from "react-icons/fa";

const Home = () => {
	const router = useRouter();
	const userData = useUserContext();

	const [joinedClassroom, setJoinedClassroom] = useState(false);
	const [joinedClassroomDetails, setJoinedClassroomDetails] = useState({
		classCode: "",
		className: "",
		classCreator: "",
	});

	const [profileDetails, setProfileDetails] = useState({
		name: userData.userName || "",
		email: userData.userEmail || "",
	});

	const [isEditingProfile, setIsEditingProfile] = useState(false);

	const { data, error } = useSWR(
		joinedClassroomDetails.classCode
			? `/classrooms/${joinedClassroomDetails.classCode}/subjects`
			: null,
		async () => {
			const docSnap = await getDocs(
				collection(
					db,
					"classrooms",
					joinedClassroomDetails.classCode,
					"subjects"
				)
			);

			const subjects = await Promise.all(
				docSnap.docs.map(async (doc) => {
					const subjectName = doc.data().subjectName;
					const quizSnap = await getDocs(
						collection(
							db,
							"classrooms",
							joinedClassroomDetails.classCode,
							"subjects",
							doc.id,
							"quizzes"
						)
					);

					return {
						subjectName,
						availableQuizzes: quizSnap.size,
					};
				})
			);

			return subjects;
		}
	);

	useEffect(() => {
		console.log(userData);
		if (userData.userEmail) {
			console.log(userData);
			setProfileDetails({
				name: userData.userName ?? "",
				email: userData.userEmail,
			});
		}
		async function getJoinedClassroomStatus() {
			if (userData.userID) {
				const docSnapshot = await getDoc(
					doc(db, "students", userData.userID)
				);
				if (docSnapshot.exists()) {
					const data = docSnapshot.data();
					if (!data?.joinedClassroom) {
						router.push("/home/join-classroom");
					} else {
						setJoinedClassroomDetails((prev) => ({
							...prev,
							classCode: data.joinedClassroom,
						}));
						setJoinedClassroom(true);
					}
				}
			}
		}
		getJoinedClassroomStatus();
	}, [userData]);

	useEffect(() => {
		async function getJoinedClassroomDetails() {
			if (
				joinedClassroom &&
				userData.userID &&
				joinedClassroomDetails?.classCode
			) {
				const docSnapshot = await getDoc(
					doc(db, "classrooms", joinedClassroomDetails?.classCode)
				);
				if (docSnapshot.exists()) {
					const data = docSnapshot.data();
					setJoinedClassroomDetails((prev) => ({
						...prev,
						className: data?.className,
						classCreator: data?.classCreator,
					}));
				}
			}
		}
		getJoinedClassroomDetails();
	}, [joinedClassroom]);

	const handleProfileEdit = async () => {
		const auth = await getAuth();
		await onAuthStateChanged(auth, async (user) => {
			if (user) {
				await updateProfile(user, {
					displayName: profileDetails.name,
				});
			} else {
				console.error("User not signed in.");
			}
		});

		setIsEditingProfile(!isEditingProfile);
	};

	const handleProfileChange = (e: any) => {
		const { name, value } = e.target;
		setProfileDetails((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="flex flex-col items-center p-4 space-y-6 w-full">
			{/* Profile Section */}
			<div className="lg:w-[60%] w-full p-4 border rounded-lg shadow-md bg-white">
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
								className="w-full bord	er rounded p-2"
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
				<div className="flex flex-row justify-between w-full">
					<button
						onClick={handleProfileEdit}
						className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
					>
						{isEditingProfile ? "Save" : "Edit"}
					</button>
					<button
						className="mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 font-semibold"
						onClick={() => {
							signOut(auth).then(() => {
								router.push("/auth");
							});
						}}
					>
						Logout
					</button>
				</div>
			</div>

			{/* Class Details Section */}
			{joinedClassroomDetails.classCode ? (
				<div className="lg:w-[60%] w-full p-4 border rounded-lg shadow-md bg-white">
					<h2 className="text-lg font-semibold mb-4">
						Classroom Details
					</h2>
					<p className="text-md text-blue-500 font-semibold">
						{joinedClassroomDetails.className} [
						{joinedClassroomDetails.classCode}]
					</p>
					<p className="text-md text-gray-500 font-medium">
						Class Teacher: {joinedClassroomDetails.classCreator}
					</p>
					<button
					className="mt-4 px-4 py-2 text-slate-600 font-semibold bg-gray-200 rounded-md"
					onClick={() => router.push('/home/join-classroom')}
				>
					Join Other Classroom
				</button>
				</div>
			) : (
				<div
					className="bg-gray-200 text-black w-56 p-4 flex flex-row items-center justify-center space-x-4 font-semibold text-xl rounded-lg cursor-pointer"
					onClick={() => {
						router.push("/home/join-classroom");
					}}
				>
					<h1>Join a Classroom</h1>
					<FaExternalLinkAlt></FaExternalLinkAlt>
				</div>
			)}

			{/* Subjects Section */}
			{joinedClassroomDetails.classCode && (
				<div className="lg:w-[60%] w-full p-4 border rounded-lg shadow-md bg-white">
					<h2 className="text-lg font-semibold mb-4">
						Available Subjects
					</h2>
					<div className="flex flex-col flex-auto">
						{error && <div>Error loading subjects</div>}
						{!data && <div>Loading...</div>}
						{data &&
							data.map((subjectObject) => (
								<SubjectCard
									key={subjectObject.subjectName}
									subjectName={subjectObject.subjectName}
									availableQuizzes={
										subjectObject.availableQuizzes
									}
								/>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
