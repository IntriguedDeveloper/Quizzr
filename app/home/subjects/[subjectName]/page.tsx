"use client";

import { useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function SubjectDetails() {
	const params = useParams<{ subjectName: string }>();
	const userData = useUserContext();
	const { data, error } = useSWR(params.subjectName, async (subjectName) => {
		if (userData.userID) {
			const classCodeDocSnap = await getDoc(
				doc(db, "students", userData.userID)
			);
			if (classCodeDocSnap.exists()) {
				const classCode = classCodeDocSnap.data().joinedClassroom;
				const quizSnap = await getDocs(
					collection(
						db,
						"classrooms",
						classCode,
						"subjects",
						subjectName,
						"quizzes"
					)
				);
				let quizzes: QuizObject[] = [];
				type QuizObject = {
					title: string;
					timeDuration: string;
					fullMarks: number;
					noOfQuestions: number;
				};
				quizSnap.docs.map((doc) => {
					quizzes.push(doc.data() as QuizObject);
				});
				return quizzes;
			}
		}
	});

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
				{params.subjectName}
			</h1>
			{data ? (
				<div className="flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
					{data.map((quiz) => (
						<div
							key={quiz.title}
							className="flex-shrink-0 w-64 p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
						>
							<h2 className="text-xl font-semibold text-gray-700 mb-2">
								{quiz.title}
							</h2>
							<p className="text-sm text-gray-500">
								<span className="font-medium">Time Duration:</span>{" "}
								{quiz.timeDuration}
							</p>
							<p className="text-sm text-gray-500">
								<span className="font-medium">Full Marks:</span>{" "}
								{quiz.fullMarks}
							</p>
							<p className="text-sm text-gray-500">
								<span className="font-medium">No of Questions:</span>{" "}
								{quiz.noOfQuestions}
							</p>
						</div>
					))}
				</div>
			) : (
				<p className="text-center text-gray-600 mt-4">Loading...</p>
			)}
		</div>
	);
}
