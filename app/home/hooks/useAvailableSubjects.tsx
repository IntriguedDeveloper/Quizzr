"use client";
import { useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";
import useSWR from "swr";
import { useClassCode } from "./useClassCode";
import useAttemptedQuizzes from "./useAttemptedQuizzes";

type SubjectListType = {
	subjectName: string;
	availableQuizzes: number;
};

export function useAvailableSubjects() {
	const userDetails = useUserContext();
	const { data: classCode } = useClassCode(userDetails.userID);

	const fetchAvailableSubjects = async (
		classCode: string
	): Promise<SubjectListType[]> => {
		const docSnap = await getDocs(
			collection(db, "classrooms", classCode, "subjects")
		);

		const subjects = await Promise.all(
			docSnap.docs.map(async (doc) => {
				const subjectName = await doc.data().subjectName;
				if (userDetails.userID) {
					const quizSnap = await getDocs(
						collection(
							db,
							"classrooms",
							classCode,
							"subjects",
							doc.id,
							"quizzes"
						)
					);
					const attemptDocSnapshot = await getDocs(
						collection(
							db,
							"classrooms",
							classCode,
							"students",
							userDetails.userID,
							"attempted-quizzes"
						)
					);
					if (!attemptDocSnapshot.empty && !quizSnap.empty) {
						return {
							subjectName,
							availableQuizzes:
								quizSnap.docs.length -
								attemptDocSnapshot.docs.length,
						};
					}
					return {
						subjectName,
						availableQuizzes: quizSnap.docs.length,
					};
				}
			})
		);

		return subjects;
	};

	const { data, error } = useSWR<SubjectListType[]>(
		classCode ? `/classrooms/${classCode}/subjects` : null,
		() => fetchAvailableSubjects(classCode || "")
	);

	return {
		subjects: data,
		isLoading: !error && !data,
		isError: error,
	};
}
