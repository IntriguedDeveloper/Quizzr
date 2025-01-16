import { useUserContext } from "@/app/context/UserContext";
import { useClassCode } from "./useClassCode";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import useSWR from "swr";

export type AttemptedQuizzesDetailsType = {
	title: string;
	selectedQuizQuestions: any[];
	timeAlloted: string;
	subjectName: string;
};

export type AttemptedQuizzesResultType = {
	displayTimeTaken: string;
	fullMarks: number;
	marksReceived: number;
	noOfQuestionsAttempted: number;
	noOfQuestionsCorrect: number;
	noOfQuestionsIncorrect: number;
	totalNoOfQuestions: number;
};

export type AttemptedQuizzesWithResultsType = {
	AttemptedQuizzesDetails: AttemptedQuizzesDetailsType;
	AttemptedQuizzesResult: AttemptedQuizzesResultType;
};

export default function useAttemptedQuizzes(): {
	attemptedQuizzesWithResults: AttemptedQuizzesWithResultsType[] | null;
	error: any;
	isLoading: boolean;
} {
	const userDetails = useUserContext();
	const { data: classCode } = useClassCode(userDetails.userID);

	async function fetchAttemptedQuizzes(
		classCode: string,
		userID: string
	): Promise<AttemptedQuizzesWithResultsType[] | null> {
		if (!classCode || !userID) return null;

		const docSnapshot = await getDocs(
			collection(
				db,
				"classrooms",
				classCode,
				"students",
				userID,
				"attempted-quizzes"
			)
		);

		if (docSnapshot.empty) return null;

		const quizzesWithResults = await Promise.all(
			docSnapshot.docs.map(async (doc) => {
				const resultDocSnap = await getDocs(
					collection(
						db,
						"classrooms",
						classCode,
						"students",
						userID,
						"attempted-quizzes",
						doc.id,
						"quiz-result"
					)
				);

				const resultData =
					resultDocSnap.docs[0]?.data() as AttemptedQuizzesResultType;

				return {
					AttemptedQuizzesDetails:
						doc.data() as AttemptedQuizzesDetailsType,
					AttemptedQuizzesResult: resultData,
				};
			})
		);

		return quizzesWithResults;
	}

	const { data, error, isLoading } = useSWR(
		classCode && userDetails.userID
			? `/classrooms/${classCode}/students/${userDetails.userID}`
			: null,
		() => fetchAttemptedQuizzes(classCode, userDetails.userID || "")
	);

	return {
		attemptedQuizzesWithResults: data || null,
		error,
		isLoading,
	};
}
