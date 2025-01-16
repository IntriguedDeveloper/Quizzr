"use client";
import { useUserContext } from "@/app/context/UserContext";
import { useQuizQuestions } from "@/app/home/hooks/useQuizQuestions";
import { useParams } from "next/navigation";
import QuizAttempt from "../_components/QuizAttempt";
import InComponentLoadingSpinner from "@/app/home/_components/InComponentLoadingSpinner";
import QuizSolutions from "../_components/QuizSolutions";
import useSWR from "swr";
import { useClassCode } from "@/app/home/hooks/useClassCode";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { QuestionConstructType } from "@/app/admin/home/manageClassroom/[classRoomCode]/_types/quizTypes";

async function fetchAttemptedQuizSolution(
	classCode: string,
	userID: string,
	quizTitle: string
): Promise<QuestionConstructType[] | null> {
	if (!classCode || !userID) return null;

	const docSnapshot = await getDoc(
		doc(
			db,
			"classrooms",
			classCode,
			"students",
			userID,
			"attempted-quizzes",
			quizTitle
		)
	);

	if (docSnapshot.exists()) {
		const AttemptedQuizArray = docSnapshot.data()
			.selectedQuizQuestions as QuestionConstructType[];
		return AttemptedQuizArray;
	}
	return null;
}
export default function QuizSolutionsPage() {
	const userDetails = useUserContext();
	const classCode = useClassCode(userDetails.userID).data;
	const params = useParams<{ subjectName: string; quizName: string }>();

	params.quizName = decodeURIComponent(params.quizName);
	const quizDetails = useQuizQuestions(
		params.quizName,
		params.subjectName,
		userDetails.userID
	).data?.quizDetails;

	const { data, error, isLoading } = useSWR(
		classCode && userDetails.userID && params.quizName
			? userDetails.userID + classCode + params.quizName
			: null,
		async () =>
			fetchAttemptedQuizSolution(
				classCode,
				userDetails.userID || "",
				params.quizName
			)
	);

	if (isLoading)
		return <InComponentLoadingSpinner></InComponentLoadingSpinner>;
	if (error) return <div>Error loading quiz data.</div>;

	return (
		<>
			{data && quizDetails && (
				<QuizSolutions
					QuizArray={data}
					QuizDetails={quizDetails}
				></QuizSolutions>
			)}
		</>
	);
}
