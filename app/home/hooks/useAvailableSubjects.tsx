"use client";
import { useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";
import useSWR from "swr";
import { useClassCode } from "./useClassCode";

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
				const subjectName = doc.data().subjectName;
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

				return {
					subjectName,
					availableQuizzes: quizSnap.size,
				};
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
