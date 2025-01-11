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
		if (!classCode) throw new Error("Class code is required.");
		if (!userDetails.userID) throw new Error("User ID is required.");

		const subjectCollectionRef = collection(
			db,
			"classrooms",
			classCode,
			"subjects"
		);
		const docSnap = await getDocs(subjectCollectionRef);

		const subjects = await Promise.all(
			docSnap.docs.map(async (doc) => {
				const subjectName = doc.data()?.subjectName;

				if (!subjectName) return null;

				const quizCollectionRef = collection(
					db,
					"classrooms",
					classCode,
					"subjects",
					doc.id,
					"quizzes"
				);
				const quizSnap = await getDocs(quizCollectionRef);
				if (userDetails.userID) {
					const attemptedQuizzesRef = collection(
						db,
						"classrooms",
						classCode,
						"students",
						userDetails.userID,
						"attempted-quizzes"
					);
					const attemptDocSnapshot = await getDocs(
						attemptedQuizzesRef
					);

					const attemptedQuizTitles = attemptDocSnapshot.docs.map(
						(attemptDoc) => attemptDoc.data()?.title
					);
					const availableQuizzes = quizSnap.docs.filter(
						(quizDoc) =>
							!attemptedQuizTitles.includes(quizDoc.data()?.title)
					).length;

					return {
						subjectName,
						availableQuizzes,
					};
				}
			})
		);

		return subjects.filter(
			(subject) => subject !== null
		) as SubjectListType[];
	};

	const { data, error } = useSWR<SubjectListType[]>(
		classCode ? `/classrooms/${classCode}/subjects` : null,
		() => fetchAvailableSubjects(classCode)
	);

	return {
		subjects: data,
		isLoading: !error && !data,
		isError: !!error,
	};
}
