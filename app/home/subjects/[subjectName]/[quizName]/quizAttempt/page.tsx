"use client";
import { useUserContext } from "@/app/context/UserContext";
import { useQuizQuestions } from "@/app/home/hooks/useQuizQuestions";
import { useParams } from "next/navigation";
import QuizAttempt from "../_components/QuizAttempt";
import InComponentLoadingSpinner from "@/app/home/_components/InComponentLoadingSpinner";

export default function QuizAttemptPage() {
	const userDetails = useUserContext();
	const params = useParams<{ subjectName: string; quizName: string }>();
	params.quizName = decodeURIComponent(params.quizName);

	const { data, error, isLoading } = useQuizQuestions(
		params.quizName,
		params.subjectName,
		userDetails.userID
	);

	if (isLoading)
		return <InComponentLoadingSpinner></InComponentLoadingSpinner>;
	if (error) return <div>Error loading quiz data.</div>;

	if (!data?.quizDetails || !data.quizQuestions || !data.classCode) {
		return <div>No quiz data available.</div>;
	}

	return (
		<QuizAttempt
			quizDetails={data.quizDetails}
			quizQuestions={data.quizQuestions}
			classCode={data.classCode}
			subjectName={params.subjectName}
		/>
	);
}
