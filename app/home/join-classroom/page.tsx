"use client";
import { useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const JoinClassroomPage: React.FC = () => {
	const userData = useUserContext();
	const [joinedClassroom, setJoinedClassroom] = useState<Boolean>(true);
	const [classCode, setClassCode] = useState<string>("");
    const router = useRouter();
	async function handleClassJoin_Student(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {
		event.preventDefault();
		if (classCode && userData.userID) {
			const collectionRef = collection(
				db,
				"classrooms",
				classCode,
				"students"
			);

			const docRef = doc(
				db,
				"classrooms",
				classCode,
				"students",
				userData.userID
			);
			const docSnapshot = await getDoc(docRef);

			if (docSnapshot.exists()) {
				alert("You have already joined this classroom");
			} else {
				await setDoc(doc(db, "students", userData.userID), {
					joinedClassroom: classCode,
				});
                router.push("/home");
			}
		}
	}
	return (
		<div className="w-max h-max flex flex-col justify-center items-center border-2 border-blue-500 rounded-lg p-10 mt-10">
			<h1 className="text-2xl m-4 text-slate-500 font-extrabold">
				Join Classroom
			</h1>
			<input
				type="text"
				placeholder="Enter class code : "
				className="p-2 rounded-md border-2 border-gray-400 outline-none text-xl"
				onChange={(event) => setClassCode(event.target.value)}
			/>
			<button
				className="mt-3 bg-blue-600 pl-10 pr-10 pt-2 pb-2 rounded-lg text-white font-semibold"
				onClick={handleClassJoin_Student}
			>
				Join
			</button>
		</div>
	);
};

export default JoinClassroomPage;
