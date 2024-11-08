// AddQuiz.tsx
"use client";
import { useUserContext } from "@/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";

interface AddQuizProps {
	classCode: string;
}

export default function AddQuiz({ classCode }: AddQuizProps) {
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
	const TeacherDetails = useUserContext();
	const teacherName = TeacherDetails?.userName || "Unknown Teacher";

	useEffect(() => {
		const fetchSelectedSubject = async () => {
			try {
				const subjectDoc = await getDocs(
					await query(
						collection(db, `classrooms/${classCode}/subjects`),
						where("relatedTeacherName", "==", TeacherDetails.userName)
					)
				);
				if (!subjectDoc.empty) {
					setSelectedSubject(subjectDoc.docs[0].id);
				}
			} catch (error) {
				console.error("Error fetching subject:", error);
			}
		};

		fetchSelectedSubject();
	}, [teacherName, classCode]);

	return (
		<div className="w-5/6 bg-blue-300 mt-2 rounded-lg flex flex-col items-center justify-center p-4 mb-5 shadow-sm">
			<h2 className="text-2xl font-semibold text-blue-800 mb-4">
				Create a Quiz
			</h2>

			<div className="text-lg font-bold">
				{selectedSubject ? (
					<>Selected Subject: {selectedSubject}</>
				) : (
					"Loading selected subject..."
				)}
			</div>
      
		</div>
	);
}
