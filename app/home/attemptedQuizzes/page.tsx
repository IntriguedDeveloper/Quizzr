"use client";

import { useRouter } from "next/navigation";
import InComponentLoadingSpinner from "../_components/InComponentLoadingSpinner";
import useAttemptedQuizzes, {
	AttemptedQuizzesResultType,
	AttemptedQuizzesWithResultsType,
} from "../hooks/useAttemptedQuizzes";
import { FaBook } from "react-icons/fa";

export default function AttemptedQuizzes() {
	const router = useRouter();
	const { attemptedQuizzesWithResults, error, isLoading } =
		useAttemptedQuizzes();

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen text-red-500">
				Error: {error.message}
			</div>
		);
	}

	return (
		<div className="flex flex-col mt-4 space-y-4 justify-start items-center h-screen">
			<h1 className="text-3xl font-bold">Attempted Quizzes</h1>
			{isLoading && (
				<InComponentLoadingSpinner></InComponentLoadingSpinner>
			)}
			<div className="text-center space-y-4">
				<div className="space-y-2">
					{attemptedQuizzesWithResults?.map(
						(quiz: AttemptedQuizzesWithResultsType, index) => (
							<div
								key={index}
								className="p-4 border rounded-md shadow-sm hover:shadow-md flex flex-col space-y-2"
							>
								<div className="text-xl font-bold text-blue-500">
									{quiz.AttemptedQuizzesDetails.title}
								</div>
								<div className="text-sm font-semibold text-gray-600">
									Questions Attempted:{" "}
									{quiz.AttemptedQuizzesResult
										.noOfQuestionsAttempted || 0}{" "}
									/{" "}
									{quiz.AttemptedQuizzesResult
										.totalNoOfQuestions || 0}
								</div>
								<div className="text-sm text-gray-600 font-semibold">
									Correct Answers:{" "}
									{quiz.AttemptedQuizzesResult
										.noOfQuestionsCorrect || 0}
								</div>
								<div className="text-sm text-gray-600 font-semibold">
									Incorrect Answers:{" "}
									{quiz.AttemptedQuizzesResult
										.noOfQuestionsIncorrect || 0}
								</div>
								<div className="text-sm text-gray-600 font-semibold">
									Marks:{" "}
									{quiz.AttemptedQuizzesResult
										.marksReceived || 0}{" "}
									/{" "}
									{quiz.AttemptedQuizzesResult.fullMarks || 0}
								</div>
								<div className="text-sm text-gray-600 font-semibold">
									Time Taken:{" "}
									{quiz.AttemptedQuizzesResult
										.displayTimeTaken || "N/A"}
								</div>
								<div className="text-sm text-gray-600 font-semibold">
									Subject Name :{" "}
									{quiz.AttemptedQuizzesDetails.subjectName ||
										"N/A"}
								</div>
								<button
									className="w-full bg-red-500 text-white font-semibold rounded-lg p-3 hover:shadow-lg"
									onClick={() => {
										router.push(
											`subjects/${quiz.AttemptedQuizzesDetails.subjectName}/${quiz.AttemptedQuizzesDetails.title}/quizAttempt`
										);
									}}
								>
									Reattempt Quiz
								</button>
								<div className="flex flex-row items-center justify-center w-full bg-gray-200 rounded-lg p-3 text-lg font-semibold hover:shadow-lg cursor-pointer" onClick={() => {
									router.push(`subjects/${quiz.AttemptedQuizzesDetails.subjectName}/${quiz.AttemptedQuizzesDetails.title}/quizSolutions`)
								}}>
									<FaBook className="mr-3 ml-3"></FaBook>
									View Quiz Solutions
								</div>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
}
