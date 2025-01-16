"use client";
import { useUserContext } from "@/app/context/UserContext";
import { useParams } from "next/navigation";
import { useState } from "react";
import QuizDetails from "./_components/QuizDetails";
import { useQuizQuestions } from "@/app/home/hooks/useQuizQuestions";
import QuizAttempt from "./_components/QuizAttempt";
export type QuizDetailsType = {
	title: string;
	timeDuration: string;
	fullMarks: number;
	noOfQuestions: number;
};

export default function QuizComponent() {
	const userDetails = useUserContext();
	let params = useParams<{ subjectName: string; quizName: string }>();
	params.quizName = decodeURIComponent(params.quizName); //quizName has a whitespace in it, so decode it

	const { data, error, isLoading } = useQuizQuestions(
		params.quizName,
		params.subjectName,
		userDetails.userID
	);

	return (
		<>
			{data?.quizDetails && data.quizQuestions && data.classCode && (
				<QuizDetails
					quizDetails={data?.quizDetails}
					quizQuestions={data?.quizQuestions}
					classCode={data.classCode}
				></QuizDetails>
			)}
		</>
	);
}
