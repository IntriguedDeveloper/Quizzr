"use client";

import { db } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import SubjectCard from "./_components/SubjectCard";
import useSWR from "swr";

type JoinedClassroomDetails = {
	classCode: string;
	className: string;
	classCreator: string;
};

type SubjectObject = {
	subjectName: string;
	availableQuizzes: number;
};

export default function Home() {
	const router = useRouter();
	const userData = useUserContext();
	const [joinedClassroom, setJoinedClassroom] = useState(false);
	const [joinedClassroomDetails, setJoinedClassroomDetails] = useState<JoinedClassroomDetails>({
		classCode: "",
		className: "",
		classCreator: "",
	});

	const { data, error } = useSWR(
		joinedClassroomDetails.classCode ? `/classrooms/${joinedClassroomDetails.classCode}/subjects` : null,
		async () => {
			const docSnap = await getDocs(
				collection(db, "classrooms", joinedClassroomDetails.classCode, "subjects")
			);

			const subjects = await Promise.all(
				docSnap.docs.map(async (doc) => {
					const subjectName = doc.data().subjectName;
					const quizSnap = await getDocs(
						collection(db, "classrooms", joinedClassroomDetails.classCode, "subjects", doc.id, "quizzes")
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
		async function getJoinedClassroomStatus() {
			if (userData.userID) {
				const docSnapshot = await getDoc(doc(db, "students", userData.userID));
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
			if (joinedClassroom && userData.userID && joinedClassroomDetails?.classCode) {
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
		<div className="flex flex-col items-center justify-center">
			<div className="flex flex-col justify-center items-center">
				<a className="font-semibold text-2xl text-blue-500">
					{joinedClassroomDetails.className} [
					{joinedClassroomDetails.classCode}]
				</a>
				<a className="font-semibold text-md text-gray-500">
					Class Teacher: {joinedClassroomDetails.classCreator}
				</a>
			</div>
			
			<div className="flex flex-wrap justify-center items-center">
				{error && <div>Error loading subjects</div>}
				{!data && <div>Loading...</div>}
				{data &&
					data.map((subjectObject: SubjectObject) => (
						<SubjectCard
							key={subjectObject.subjectName}
							subjectName={subjectObject.subjectName}
							availableQuizzes={subjectObject.availableQuizzes}
						/>
					))}
			</div>
		</div>
	);
}
