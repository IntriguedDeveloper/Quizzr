"use client";

import { db } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
type JoinedClassroomDetails = {
	classCode: string;
	className: string;
	classCreator: string;
};
export default function Home() {
	const router = useRouter();
	const userData = useUserContext();
	const [joinedClassroom, setJoinedClassroom] = useState<Boolean>(false);
	const [joinedClassroomDetails, setJoinedClassroomDetails] =
		useState<JoinedClassroomDetails>({
			classCode: "",
			className: "",
			classCreator: "",
		});
	useEffect(() => {
		async function getJoinedClassroomStatus() {
			if (userData.userID) {
				console.log(userData.userID);
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

	return (
		<div className="flex flex-col justify-center items-center">
			<a className="font-semibold text-2xl text-blue-500">{joinedClassroomDetails.className}  [{joinedClassroomDetails.classCode}]</a>
			<a className="font-semibold text-md text-gray-500">Class Teacher  : {joinedClassroomDetails.classCreator}</a>
			<a></a>
		</div>
	);
}
