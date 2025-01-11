import { useUserContext } from "@/app/context/UserContext";
import { useClassCode } from "./useClassCode";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import useSWR from "swr";
export type AttemptedQuizzesType = {
	title: string;
	selectedQuizQuestions: any[];
	timeTaken: string;
};
export default function useAttemptedQuizzes(): {
	attemptedQuizzes: AttemptedQuizzesType[] | null;
	error: any;
} {
	const userDetails = useUserContext();
	const { data: classCode } = useClassCode(userDetails.userID);

	async function fetchAttemptedQuizzes(
		classCode: string,
		userID: string
	): Promise<AttemptedQuizzesType[] | null> {
		if (classCode && userDetails.userID) {
			console.log(
				"classrooms",
				classCode,
				"students",
				userID,
				"attempted-quizzes"
			);
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
			if (!docSnapshot.empty) {
				return docSnapshot.docs.map(
					(doc) => doc.data() as AttemptedQuizzesType
				);
			}
		}
		return null;
	}
	const { data, error } = useSWR(
		classCode && userDetails.userID
			? `/classrooms/${classCode}/students/${userDetails.userID}`
			: null,
		() => fetchAttemptedQuizzes(classCode, userDetails.userID || "")
	);
	if (data) {
		return {
			attemptedQuizzes: data,
			error: error,
		};
	}

	return {
		attemptedQuizzes: null,
		error: error,
	};
}
